use std::path::PathBuf;
use std::fs;
use std::ptr::null;
use serde_json::Value;

#[derive(Clone, serde::Serialize)]
struct ViewContainer {
  id: String,
  title: String,
  icon: String, // File
  views: Vec<String>,
}

#[derive(Clone, serde::Serialize)]
struct HareSideBarMenu {
  parentId: String, // Which menu is the parent
  id: String,
  title: String,
  when: String, // File
}

#[derive(Clone, serde::Serialize)]
pub struct HareExtension {
  root: String,
  id: String,
  version: String,
  name: String,
  description: String,
  main: String,
  activity_bar_menus: Option<Vec<ViewContainer>>,
  views: Option<Vec<HareSideBarMenu>>
}

//TODO: check for activation events

impl HareExtension {
  pub fn new(path:PathBuf) -> HareExtension {
    let file = fs::File::open(path.clone().join("package.json"))
        .expect("file should open read only");
    let json: serde_json::Value = serde_json::from_reader(file)
        .expect("file should be proper JSON");
  
    // MUST EXIST
    let id: String = json.get("name").expect("file should have name key").to_string();
    let version = json.get("version").expect("file should have version key").to_string();
    let name = json.get("displayName").expect("file should have displayName key").to_string();
    let description = json.get("description").expect("file should have description key").to_string();

    // TODO: this for every type of contribution
    // CAN EXIST
    let main_raw = json.get("main");
    let mut main: String = "".into();

    if main_raw.is_some() {
      main = main_raw.expect("main should exist").to_string().trim_matches(|c| c == '\"' || c == '\'').to_string();
      main = read_file(path.join(main).to_str().unwrap().into()).unwrap()
    }

    let contributes: Value = json.get("contributes").unwrap().clone();
    let views_containers = contributes.get("viewsContainers");

    let mut activity_bar_menus: Option<Vec<ViewContainer>> = None;
    let mut views: Option<Vec<HareSideBarMenu>> = None;

    if views_containers.is_some() {
      let views_containers: Value = views_containers.unwrap().clone();
      let activitybar: Value = views_containers.get("primary_bar").unwrap().clone();
      activity_bar_menus = Some(Self::load_activitybar(path.clone(), activitybar));
    }

    let views_raw = contributes.get("views");

    if views_raw.is_some() {
      let views_raw: Value = views_raw.unwrap().clone();
      views = Some(Self::load_side_bar_menus(views_raw));
    }

    HareExtension {
      root: path.to_str().unwrap().into(),
      id: id.trim_matches(|c| c == '\"' || c == '\'').to_string(),
      version: version.trim_matches(|c| c == '\"' || c == '\'').to_string(),
      name: name.trim_matches(|c| c == '\"' || c == '\'').to_string(),
      description: description.trim_matches(|c| c == '\"' || c == '\'').to_string(),
      main,
      activity_bar_menus,
      views
    }
  }

  fn check_locale() {
    // TODO: if name enclosed in %% check for locales 
  }

  fn load_activitybar(root:PathBuf, json: Value) -> Vec<ViewContainer>{
    let mut activitybar: Vec<ViewContainer> = Vec::new();
    
    for entry in json.as_array().unwrap().to_vec() {
      let id: String = entry.get("id").expect("file should have id key").to_string();
      let title = entry.get("title").expect("file should have title key").to_string();
      let icon: String = entry.get("icon").expect("file should have icon key").to_string().trim_matches(|c| c == '\"' || c == '\'').to_string();
      activitybar.push(
        ViewContainer {
          id: id.trim_matches(|c| c == '\"' || c == '\'').to_string(),
          title: title.trim_matches(|c| c == '\"' || c == '\'').to_string(),
          icon: read_file(root.join(icon).to_str().unwrap().into()).unwrap(),
          views: [].to_vec()
        }
      );
    }

    return activitybar;
  }

  fn load_side_bar_menus(views: Value) -> Vec<HareSideBarMenu>{
    let mut new_views: Vec<HareSideBarMenu> = Vec::new();
    
    for view in views.as_object().unwrap() {
      let (key, val) = view;
      for entry in val.as_array().unwrap().to_vec() {
        let id = entry.get("id").expect("file should have id key").to_string();
        let title = entry.get("title").expect("file should have title key").to_string();

        let tmp_when = entry.get("when");
        let mut when: String = "true".into();
        if tmp_when.is_some() {
          when = tmp_when.unwrap().to_string().trim_matches(|c| c == '\"' || c == '\'').to_string();
        }
        new_views.push(
          HareSideBarMenu {
            parentId: key.to_string(),
            id: id.trim_matches(|c| c == '\"' || c == '\'').to_string(),
            title: title.trim_matches(|c| c == '\"' || c == '\'').to_string(),
            when
          }
        );
      }
    }

    return new_views;
  }


}

fn read_file(file_path: String) -> Result<String, String> {
    match fs::metadata(file_path.clone()) {
        Ok(metadata) => {
            if metadata.is_file() {
                let file_contents = fs::read_to_string(file_path).unwrap();
                return Ok(file_contents);
            } else {
                println!("Path exists, but it's not a file.");
                return Err("Path exists, but it's not a file.".into());
                // Handle the case where the path exists but is not a file
            }
        }
        Err(_) => {
            println!("File does not exist.");
            return Err("File does not exist.".into());
            // Handle the case where the file does not exist
        }
    }
}