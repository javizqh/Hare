use serde_json::Value;
use std::fs;
use std::path::PathBuf;

#[derive(Clone, serde::Serialize)]
struct ViewContainer {
    id: String,
    title: String,
    icon: String, // File
    views: Vec<String>,
}

#[derive(Clone, serde::Serialize)]
struct HareView {
    parent: String, // Which menu is the parent
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
    category: Option<String>,
}

//TODO: check if add submenu
#[derive(Clone, serde::Serialize)]
struct Menu {
    parent: String, // Which menu is the parent
    command: String,
    when: String,
    group: Option<String>,
}

#[derive(Clone, serde::Serialize)]
struct Configuration {
    id: String,
    title: String,
    order: Option<i32>,
    properties: String,
}

//TODO: missing capabilities, colors, icons(Do not make sense), submenus, keybindings, customEditors, viewsWelcome, walkthroughs
#[derive(Clone, serde::Serialize)]
pub struct HareExtension {
    root: String,
    id: String,
    version: String,
    name: String,
    description: String,
    main: Option<String>,
    activation_events: Option<Vec<String>>,
    primary_bar_menus: Option<Vec<ViewContainer>>,
    panel_menus: Option<Vec<ViewContainer>>,
    views: Option<Vec<HareView>>,
    icon_packs: Option<Vec<IconPack>>,
    commands: Option<Vec<JsonCommand>>,
    menus: Option<Vec<Menu>>,
    configurations: Option<Vec<Configuration>>,
}

impl HareExtension {
    pub fn new(path: PathBuf) -> HareExtension {
        let file =
            fs::File::open(path.clone().join("package.json")).expect("file should open read only");
        let json: serde_json::Value =
            serde_json::from_reader(file).expect("file should be proper JSON");

        // MUST EXIST
        let id: String = json
            .get("name")
            .expect("Extension must have a name")
            .to_string();
        let version = json
            .get("version")
            .expect("Extension must have a version")
            .to_string();
        let name = json
            .get("displayName")
            .expect("Extension must have a display name")
            .to_string();
        let description = json
            .get("description")
            .expect("Extension must have a description")
            .to_string();

        // OPTIONAL
        let main_raw = json.get("main");
        let activation_raw = json.get("activationEvents");

        let mut main: Option<String> = None;
        let mut activation_events: Option<Vec<String>> = None;

        if main_raw.is_some() {
            let main_raw: Value = main_raw.unwrap().clone();
            main = Some(
                main_raw
                    .to_string()
                    .trim_matches(|c| c == '\"' || c == '\'')
                    .to_string(),
            );
        }

        if activation_raw.is_some() {
            let activation_raw: Value = activation_raw.unwrap().clone();
            activation_events = Some(Self::load_activation_events(activation_raw));
        }

        // CONTRIBUTES /////////////////////////////////////////////////////////////
        let contributes: Value = json
            .get("contributes")
            .expect("Extension must have contribute")
            .clone();

        let views_containers_raw = contributes.get("viewsContainers");
        let views_raw = contributes.get("views");
        let icon_packs_raw = contributes.get("iconPack");
        let commands_raw = contributes.get("commands");
        let menus_raw = contributes.get("menus");
        let configurations_raw = contributes.get("configuration");

        let mut primary_bar_menus: Option<Vec<ViewContainer>> = None;
        let mut panel_menus: Option<Vec<ViewContainer>> = None;
        let mut views: Option<Vec<HareView>> = None;
        let mut icon_packs: Option<Vec<IconPack>> = None;
        let mut commands: Option<Vec<JsonCommand>> = None;
        let mut menus: Option<Vec<Menu>> = None;
        let mut configurations: Option<Vec<Configuration>> = None;

        if views_containers_raw.is_some() {
            let views_containers: Value = views_containers_raw.unwrap().clone();
            primary_bar_menus = Some(Self::load_view_container(
                path.clone(),
                "primary_bar".into(),
                views_containers.clone(),
            ));
            panel_menus = Some(Self::load_view_container(
                path.clone(),
                "panel".into(),
                views_containers.clone(),
            ));
        }

        if views_raw.is_some() {
            let views_raw: Value = views_raw.unwrap().clone();
            views = Some(Self::load_views(views_raw));
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
            menus = Some(Self::load_menus(menus_raw.clone()));
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
            description: description
                .trim_matches(|c| c == '\"' || c == '\'')
                .to_string(),
            main,
            activation_events,
            primary_bar_menus,
            panel_menus,
            views,
            icon_packs,
            commands,
            menus,
            configurations,
        }
    }

    fn check_locale() {
        // TODO: if name enclosed in %% check for locales
    }

    fn load_activation_events(array: Value) -> Vec<String> {
        let mut new_events: Vec<String> = Vec::new();

        for entry in array.as_array().unwrap().to_vec() {
            new_events.push(entry.to_string());
        }

        return new_events;
    }

    fn load_view_container(root: PathBuf, view_type: String, json: Value) -> Vec<ViewContainer> {
        let mut view_containers: Vec<ViewContainer> = Vec::new();

        let container_json = json.get(view_type);

        if container_json.is_none() {
            return view_containers;
        }

        let json = container_json.unwrap();

        for entry in json.as_array().unwrap().to_vec() {
            let id: String = entry
                .get("id")
                .expect("View container must have an id")
                .to_string();
            let title = entry
                .get("title")
                .expect("View container must have a title")
                .to_string();
            let icon: String = entry
                .get("icon")
                .expect("View container must have an icon")
                .to_string()
                .trim_matches(|c| c == '\"' || c == '\'')
                .to_string();
            view_containers.push(ViewContainer {
                id: id.trim_matches(|c| c == '\"' || c == '\'').to_string(),
                title: title.trim_matches(|c| c == '\"' || c == '\'').to_string(),
                icon: root.join(icon).to_str().unwrap().into(),
                views: [].to_vec(),
            });
        }

        return view_containers;
    }

    fn load_views(views: Value) -> Vec<HareView> {
        let mut new_views: Vec<HareView> = Vec::new();

        for view in views.as_object().unwrap() {
            let (key, val) = view;
            for entry in val.as_array().unwrap().to_vec() {
                let id = entry.get("id").expect("View must have an id").to_string();
                let title = entry
                    .get("title")
                    .expect("View must have a title")
                    .to_string();

                let tmp_when = entry.get("when");
                let mut when: String = "true".into();
                if tmp_when.is_some() {
                    when = tmp_when
                        .unwrap()
                        .to_string()
                        .trim_matches(|c| c == '\"' || c == '\'')
                        .to_string();
                }
                new_views.push(HareView {
                    parent: key.to_string(),
                    id: id.trim_matches(|c| c == '\"' || c == '\'').to_string(),
                    title: title.trim_matches(|c| c == '\"' || c == '\'').to_string(),
                    when,
                });
            }
        }

        return new_views;
    }

    fn load_icon_packs(array: Value) -> Vec<IconPack> {
        let mut new_icon_packs: Vec<IconPack> = Vec::new();

        for entry in array.as_array().unwrap().to_vec() {
            let id = entry
                .get("id")
                .expect("Icon pack must have an id")
                .to_string();
            let title = entry
                .get("title")
                .expect("Icon pack must have a title")
                .to_string();
            let path = entry
                .get("path")
                .expect("Icon pack must have a path")
                .to_string();
            new_icon_packs.push(IconPack {
                id: id.trim_matches(|c| c == '\"' || c == '\'').to_string(),
                title: title.trim_matches(|c| c == '\"' || c == '\'').to_string(),
                path: path.trim_matches(|c| c == '\"' || c == '\'').to_string(),
            });
        }

        return new_icon_packs;
    }

    fn load_commands(array: Value) -> Vec<JsonCommand> {
        let mut new_commands: Vec<JsonCommand> = Vec::new();

        for entry in array.as_array().unwrap().to_vec() {
            let command = entry
                .get("command")
                .expect("Command must have an id")
                .to_string();
            let title = entry
                .get("title")
                .expect("Command must have a title")
                .to_string();

            let tmp_icon = entry.get("icon");
            let mut icon: Option<Icon> = None;
            if tmp_icon.is_some() {
                icon = Some(Icon {
                    light: tmp_icon
                        .unwrap()
                        .get("light")
                        .expect("Icon must have a light path")
                        .to_string()
                        .trim_matches(|c| c == '\"' || c == '\'')
                        .to_string(),
                    dark: tmp_icon
                        .unwrap()
                        .get("dark")
                        .expect("Icon must have a dark path")
                        .to_string()
                        .trim_matches(|c| c == '\"' || c == '\'')
                        .to_string(),
                    when: None,
                })
            }

            let tmp_category: Option<&Value> = entry.get("category");
            let mut category: Option<String> = None;
            if tmp_category.is_some() {
                category = Some(
                    tmp_category
                        .unwrap()
                        .to_string()
                        .trim_matches(|c| c == '\"' || c == '\'')
                        .to_string(),
                );
            }

            new_commands.push(JsonCommand {
                command: command.trim_matches(|c| c == '\"' || c == '\'').to_string(),
                title: title.trim_matches(|c| c == '\"' || c == '\'').to_string(),
                icon,
                category,
            });
        }

        return new_commands;
    }

    fn load_menus(json: Value) -> Vec<Menu> {
        let mut menu_commands: Vec<Menu> = Vec::new();

        for view in json.as_object().unwrap() {
            let (key, val) = view;
            for entry in val.as_array().unwrap().to_vec() {
                let command: String = entry
                    .get("command")
                    .expect("Menu must have a command id")
                    .to_string();
                let when = entry
                    .get("when")
                    .expect("Menu must have a when field")
                    .to_string();

                let tmp_group = entry.get("group");
                let mut group: Option<String> = None;
                if tmp_group.is_some() {
                    group = Some(
                        tmp_group
                            .unwrap()
                            .to_string()
                            .trim_matches(|c| c == '\"' || c == '\'')
                            .to_string(),
                    );
                }

                menu_commands.push(Menu {
                    parent: key.to_string(),
                    command: command.trim_matches(|c| c == '\"' || c == '\'').to_string(),
                    when: when.trim_matches(|c| c == '\"' || c == '\'').to_string(),
                    group,
                });
            }
        }

        return menu_commands;
    }

    fn load_configurations(array: Value) -> Vec<Configuration> {
        let mut new_configurations: Vec<Configuration> = Vec::new();

        for entry in array.as_array().unwrap().to_vec() {
            let id = entry
                .get("id")
                .expect("Configuration must have an id")
                .to_string();
            let title = entry
                .get("title")
                .expect("Configuration must have a title")
                .to_string();
            let properties = entry
                .get("properties")
                .expect("Configuration must have properties")
                .to_string();

            let tmp_order = entry.get("order");
            let mut order: Option<i32> = None;
            if tmp_order.is_some() {
                order = Some(
                    tmp_order
                        .unwrap()
                        .to_string()
                        .trim_matches(|c| c == '\"' || c == '\'')
                        .to_string()
                        .parse()
                        .unwrap(),
                );
            }

            new_configurations.push(Configuration {
                id: id.trim_matches(|c| c == '\"' || c == '\'').to_string(),
                title: title.trim_matches(|c| c == '\"' || c == '\'').to_string(),
                order,
                properties: properties
                    .trim_matches(|c| c == '\"' || c == '\'')
                    .to_string(),
            });
        }

        return new_configurations;
    }
}
