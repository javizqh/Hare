use std::fs;

//TODO: search gap buffer y tree sitter

pub fn hare_read_file(file_path: String) -> Result<String, String> {
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
