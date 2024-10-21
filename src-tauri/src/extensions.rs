use std::path::PathBuf;
use std::fs;
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
struct Icon {
  light: String,
  dark: String,
  when: Option<String>,
}


#[derive(Clone, serde::Serialize)]
struct IconPack {
  id: String,
  title: String,
  path: String,
}

#[derive(Clone, serde::Serialize)]
struct JsonCommand {
  command: String,
  title: String,
  icon: Option<Icon>,
}

#[derive(Clone, serde::Serialize)]
struct MenuCommand {
  command: String,
  when: String,
  group: Option<String>,
}

//TODO: add all submenus
#[derive(Clone, serde::Serialize)]
struct Menu {
  view_title: Option<Vec<MenuCommand>>,
  view_item_context: Option<Vec<MenuCommand>>,
}

#[derive(Clone, serde::Serialize)]
struct Configuration {
  title: String,
  properties: String,
}
#[derive(Clone, serde::Serialize)]
pub struct HareExtension {
  root: String,
  id: String,
  version: String,
  name: String,
  description: String,
  main: String,
  primary_bar_menus: Option<Vec<ViewContainer>>,
  panel_menus: Option<Vec<ViewContainer>>,
  views: Option<Vec<HareSideBarMenu>>,
  icon_packs: Option<Vec<IconPack>>,
  commands: Option<Vec<JsonCommand>>,
  menus: Option<Menu>,
  configurations: Option<Vec<Configuration>>
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

    let main_raw = json.get("main");
    let mut main: String = "".into();

    if main_raw.is_some() {
      main = main_raw.expect("main should exist").to_string().trim_matches(|c| c == '\"' || c == '\'').to_string();
    }

    // CONTRIBUTES /////////////////////////////////////////////////////////////
    let contributes: Value = json.get("contributes").unwrap().clone();

    let views_containers_raw = contributes.get("viewsContainers");
    let views_raw = contributes.get("views");
    let icon_packs_raw = contributes.get("iconPack");
    let commands_raw = contributes.get("commands");
    let menus_raw = contributes.get("menus");
    let configurations_raw = contributes.get("configuration");

    let mut primary_bar_menus: Option<Vec<ViewContainer>> = None;
    let mut panel_menus: Option<Vec<ViewContainer>> = None;
    let mut views: Option<Vec<HareSideBarMenu>> = None;
    let mut icon_packs: Option<Vec<IconPack>> = None;
    let mut commands: Option<Vec<JsonCommand>> = None;
    let mut menus: Option<Menu> = None;
    let mut configurations: Option<Vec<Configuration>> = None;

    if views_containers_raw.is_some() {
      let views_containers: Value = views_containers_raw.unwrap().clone();
      primary_bar_menus = Some(Self::load_view_container(path.clone(), "primary_bar".into(), views_containers.clone()));
      panel_menus = Some(Self::load_view_container(path.clone(), "panel".into(), views_containers.clone()));
    }

    if views_raw.is_some() {
      let views_raw: Value = views_raw.unwrap().clone();
      views = Some(Self::load_side_bar_menus(views_raw));
    }

    if icon_packs_raw.is_some() {
      let icon_packs_raw: Value = icon_packs_raw.unwrap().clone();
      icon_packs = Some(Self::load_icon_packs(icon_packs_raw));
    }

    if commands_raw.is_some() {
      let commands_raw: Value = commands_raw.unwrap().clone();
      commands = Some(Self::load_commands(commands_raw));
    }

    if menus_raw.is_some() {
      let menus_raw: Value = menus_raw.unwrap().clone();
      menus = Some(Menu {
        view_title: Self::load_menus("view/title".into(), menus_raw.clone()),
        view_item_context: Self::load_menus("view/item/context".into(), menus_raw.clone()),
      });
    }

    if configurations_raw.is_some() {
      let configurations_raw: Value = configurations_raw.unwrap().clone();
      configurations = Some(Self::load_configurations(configurations_raw));
    }

    HareExtension {
      root: path.to_str().unwrap().into(),
      id: id.trim_matches(|c| c == '\"' || c == '\'').to_string(),
      version: version.trim_matches(|c| c == '\"' || c == '\'').to_string(),
      name: name.trim_matches(|c| c == '\"' || c == '\'').to_string(),
      description: description.trim_matches(|c| c == '\"' || c == '\'').to_string(),
      main,
      primary_bar_menus,
      panel_menus,
      views,
      icon_packs,
      commands,
      menus,
      configurations
    }
  }

  fn check_locale() {
    // TODO: if name enclosed in %% check for locales 
  }

  fn load_view_container(root: PathBuf, view_type: String, json: Value) -> Vec<ViewContainer>{
    let mut view_containers: Vec<ViewContainer> = Vec::new();

    let container_json = json.get(view_type);

    if container_json.is_none() {
      return view_containers
    }

    let json = container_json.unwrap();
    
    for entry in json.as_array().unwrap().to_vec() {
      let id: String = entry.get("id").expect("file should have id key").to_string();
      let title = entry.get("title").expect("file should have title key").to_string();
      let icon: String = entry.get("icon").expect("file should have icon key").to_string().trim_matches(|c| c == '\"' || c == '\'').to_string();
      view_containers.push(
        ViewContainer {
          id: id.trim_matches(|c| c == '\"' || c == '\'').to_string(),
          title: title.trim_matches(|c| c == '\"' || c == '\'').to_string(),
          icon: root.join(icon).to_str().unwrap().into(),
          views: [].to_vec()
        }
      );
    }

    return view_containers;
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

  fn load_icon_packs(array: Value) -> Vec<IconPack>{
    let mut new_icon_packs: Vec<IconPack> = Vec::new();
    
    for entry in array.as_array().unwrap().to_vec() {
      let id = entry.get("id").expect("Icon pack must have an id").to_string();
      let title = entry.get("title").expect("Icon pack must have a title").to_string();
      let path = entry.get("path").expect("Icon pack must have a path").to_string();
      new_icon_packs.push(
        IconPack {
          id: id.trim_matches(|c| c == '\"' || c == '\'').to_string(),
          title: title.trim_matches(|c| c == '\"' || c == '\'').to_string(),
          path: path.trim_matches(|c| c == '\"' || c == '\'').to_string()
        }
      );
    }

    return new_icon_packs;
  }

  fn load_commands(array: Value) -> Vec<JsonCommand>{
    let mut new_commands: Vec<JsonCommand> = Vec::new();
    
    for entry in array.as_array().unwrap().to_vec() {
      let command = entry.get("command").expect("Command must have an id").to_string();
      let title = entry.get("title").expect("Command must have a title").to_string();

      let tmp_icon = entry.get("icon");
      let mut icon: Option<Icon> = None;
      if tmp_icon.is_some() {
        icon = Some(Icon {
          light: tmp_icon.unwrap().get("light").expect("Icon must have a light path").to_string().trim_matches(|c| c == '\"' || c == '\'').to_string(),
          dark: tmp_icon.unwrap().get("dark").expect("Icon must have a dark path").to_string().trim_matches(|c| c == '\"' || c == '\'').to_string(),
          when: None
        })
      }

      new_commands.push(
        JsonCommand {
          command: command.trim_matches(|c| c == '\"' || c == '\'').to_string(),
          title: title.trim_matches(|c| c == '\"' || c == '\'').to_string(),
          icon
        }
      );
    }

    return new_commands;
  }

  fn load_menus(menu_type: String, json: Value) -> Option<Vec<MenuCommand>>{
    let mut menu_commands: Vec<MenuCommand> = Vec::new();

    let container_json = json.get(menu_type);

    if container_json.is_none() {
      return None
    }

    let json = container_json.unwrap();
    
    for entry in json.as_array().unwrap().to_vec() {
      let command: String = entry.get("command").expect("Menu must have a command id").to_string();
      let when = entry.get("when").expect("Menu must have a when field").to_string();

      let tmp_group = entry.get("group");
      let mut group: Option<String> = None ;
      if tmp_group.is_some() {
        group = Some(tmp_group.unwrap().to_string().trim_matches(|c| c == '\"' || c == '\'').to_string());
      }

      menu_commands.push(
        MenuCommand {
          command: command.trim_matches(|c| c == '\"' || c == '\'').to_string(),
          when: when.trim_matches(|c| c == '\"' || c == '\'').to_string(),
          group
        }
      );
    }

    return Some(menu_commands);
  }

  fn load_configurations(array: Value) -> Vec<Configuration>{
    let mut new_configurations: Vec<Configuration> = Vec::new();
    
    for entry in array.as_array().unwrap().to_vec() {
      let title = entry.get("title").expect("Configuration must have a title").to_string();
      let properties = entry.get("properties").expect("Configuration must have properties").to_string();

      new_configurations.push(
        Configuration {
          title: title.trim_matches(|c| c == '\"' || c == '\'').to_string(),
          properties: properties.trim_matches(|c| c == '\"' || c == '\'').to_string()
        }
      );
    }

    return new_configurations;
  }

}