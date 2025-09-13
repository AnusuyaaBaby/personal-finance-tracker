use actix_files::Files;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use std::fs::{File, OpenOptions};
use std::io::BufReader;

#[derive(Serialize, Deserialize, Debug)]
struct Transaction {
    kind: String,       // "income" or "expense"
    category: String,
    amount: f64,
    description: String,
    date: NaiveDate,
}

const DATA_FILE: &str = "data/transactions.json";

#[post("/add")]
async fn add_transaction(tx: web::Json<Transaction>) -> impl Responder {
    // Load existing transactions
    let mut transactions = if let Ok(file) = File::open(DATA_FILE) {
        let reader = BufReader::new(file);
        serde_json::from_reader(reader).unwrap_or(Vec::new())
    } else {
        Vec::new()
    };

    transactions.push(tx.into_inner());

    // Save back
    let file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(DATA_FILE)
        .unwrap();

    serde_json::to_writer_pretty(file, &transactions).unwrap();

    HttpResponse::Ok().json(&transactions)
}

#[get("/list")]
async fn list_transactions() -> impl Responder {
    let file = File::open(DATA_FILE).unwrap_or(File::create(DATA_FILE).unwrap());
    let reader = BufReader::new(file);
    let transactions: Vec<Transaction> = serde_json::from_reader(reader).unwrap_or(Vec::new());
    HttpResponse::Ok().json(transactions)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::fs::create_dir_all("data")?; // Ensure data folder exists

    HttpServer::new(|| {
        App::new()
            .service(add_transaction)
            .service(list_transactions)
            .service(Files::new("/", "./static").index_file("index.html"))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
