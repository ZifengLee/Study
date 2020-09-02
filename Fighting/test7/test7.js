var hang, gezi;
hang = document.createElement("div");
hang.id = "hang";
for (let i = 0; i < 5; i++) {
    let gz = document.createElement("div");
    gz.id = "gezi";

    hang.appendChild(gz);
}

document.body.appendChild(hang);
