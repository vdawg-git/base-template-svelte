import { copyFile } from "node:fs"

copyFile("./dist/index.html", "./dist/200.html", (error) =>
  error ? console.error(error) : console.log("Created 200.html")
)
