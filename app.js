//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-khalil:lilottoo89.@cluster0.rsiiq.mongodb.net/todolistDB", { useNewUrlParser: true });

const workItems = [];


const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
    name: "wilson",
});
const item2 = new Item({
    name: "Mr robot",
});
const item3 = new Item({
    name: "Kim",
})

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}
const List = mongoose.model("List", listSchema);
const day = date.getDate();

app.get("/", function(req, res) {
    Item.find({}, function(err, foundItem) {
        if (foundItem.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log("error");
                } else {
                    console.log("added successfully ya deg");
                }


            });
            res.render("list", { listTitle: day, newListItems: foundItem });
        }

        res.render("list", { listTitle: day, newListItems: foundItem });
    })




});

app.post("/", function(req, res) {

    const itemName = req.body.newItem;
    const itemNewList = req.body.list;
    const ItemAdd = new Item({
        name: itemName
    })
    ItemAdd.save();
    res.redirect("/");


});



app.post("/delet", function(req, res) {
    const checkedItem = req.body.checkbox;
    Item.findByIdAndRemove(checkedItem, function(err) {
        if (err) {
            console.log("erreur deleting");
            res.redirect("/");
        } else {
            console.log("deleted success");
            res.redirect("/");
        }
    })

})

app.get("/:custom", function(req, res) {

    customeListeName = req.params.custom;

    List.findOne({ name: customeListeName }, function(err, foundlist) {
        if (err) { console.log("erreur") } else { console.log("pas d'err") };
        if (foundlist) {
            res.render("list", { listTitle: customeListeName, newListItems: foundlist });
        } else {
            const list = new List({
                name: customeListeName,
                items: defaultItems
            });
            list.save();
            res.render("list", { listTitle: customeListeName, newListItems: defaultItems });
        }


    })

});


app.get("/about", function(req, res) {
    res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("Server started successfully");
});