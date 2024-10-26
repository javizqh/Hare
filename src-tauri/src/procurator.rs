use std::sync::{LazyLock, Mutex};

pub struct Command {
    pub id: String,
    pub callback: Option<fn(data:&String) -> Result<&str, &str>>,
}

pub struct Procurator {
    pub extension_dir: Option<String>,
    pub commands: Vec<Command>
}

pub static PROCURATOR: LazyLock<Mutex<Procurator>> = LazyLock::new(|| Mutex::new(Procurator {extension_dir:None,commands:vec![]}));

pub fn add_command (id: String) {
    if !PROCURATOR.lock().unwrap().commands.iter().any(|i| i.id==id) {
        println!("Adding backend command {}", id);
        PROCURATOR.lock().unwrap().commands.push(Command {id, callback: None});
    } 
}

pub fn register_command (id: String, callback:fn(data:&String) -> Result<&str, &str>) {
    let index = PROCURATOR.lock().unwrap().commands.iter().position(|i| i.id==id);

    if index.is_some() {
        let index = index.unwrap();
        println!("Registering command {} {}", id, index);
        PROCURATOR.lock().unwrap().commands[index].callback = Some(callback);
        let _ = callback(&"".to_string()); //Executing the callback once works
    }
}

pub fn execute_command (id: String, data: String) -> Result<String, String>{
    let index = PROCURATOR.lock().unwrap().commands.iter().position(|i| i.id==id);

    if index.is_none() {
        return Err("Command not found".into());
    }

    let index = index.unwrap();
    if PROCURATOR.lock().unwrap().commands[index].callback.is_none() {
        return Err("Command is not registered".into());
    }

    let callback_res = PROCURATOR.lock().unwrap().commands[index].callback.unwrap()(&data);

    let callback_return = match callback_res {
        Ok(data) => Ok(data.to_string()),
        Err(error) => Err(error.to_string()),
    };

    println!("{:?}",callback_return);
    
    return callback_return;
}