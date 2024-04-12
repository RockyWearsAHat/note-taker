import express from "express";
import fs from "fs";

const port = 3000;
const app = new express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(process.cwd() + "/public"));

app.get("/api/notes", (req, res) => {
  let fileContents = JSON.parse(
    fs.readFileSync(process.cwd() + "/db/db.json").toString()
  );
  res.json(fileContents);
});

app.post(
  "/api/notes",
  (req, res, next) => {
    if (!req.body.title || !req.body.text) {
      res
        .status(500)
        .json("Error posting note, title and body for note must not be blank");

      return;
    }
    next();
  },
  (req, res) => {
    let fileContents = JSON.parse(
      fs.readFileSync(process.cwd() + "/db/db.json").toString()
    );
    fileContents.push({
      id:
        fileContents.length > 0
          ? fileContents[fileContents.length - 1].id + 1
          : 0,
      title: req.body.title,
      text: req.body.text,
    });
    fs.writeFileSync(
      process.cwd() + "/db/db.json",
      JSON.stringify(fileContents, null, 2)
    );
    res.json(fileContents);
  }
);

app.delete("/api/notes/:id", (req, res) => {
  req.params.id;

  let fileContents = JSON.parse(
    fs.readFileSync(process.cwd() + "/db/db.json").toString()
  );

  for (let i = 0; i < fileContents.length; i++) {
    if (req.params.id == fileContents[i].id) {
      fileContents.splice(i, 1);
    }
  }

  fs.writeFileSync(
    process.cwd() + "/db/db.json",
    JSON.stringify(fileContents, null, 2)
  );

  res.json(fileContents);
});

app.get("/notes", (req, res) => {
  res.sendFile("/notes.html", { root: "public" });
});

app.get("/", (req, res) => {
  res.sendFile("/index.html", { root: "public" });
});

app.get("*", (req, res) => {
  res.sendFile("/index.html", { root: "public" });
});

app.listen(process.env.PORT || port, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || port}`
  );
});
