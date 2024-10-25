use std::sync::{LazyLock, Mutex};

pub struct Command {
    pub id: String,
    pub callback: Option<fn()>,
}

pub struct Procurator {
    pub extension_dir: Option<String>,
    pub commands: Vec<Command>
}

pub static PROCURATOR: LazyLock<Mutex<Procurator>> = LazyLock::new(|| Mutex::new(Procurator {extension_dir:None,commands:vec![]}));

pub fn add_command (id: String, callback:Option<fn()>) {
  println!("Adding command {}", id);
  //TODO: check if it already existed
  PROCURATOR.lock().unwrap().commands.push(Command {id, callback});
  //TODO: tmp
  if callback.is_some() {
      callback.unwrap()();
  }
}