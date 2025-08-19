const User = require("../models/users");

module.exports.getDashboard=(req,res)=>{
    res.render("admin/dashboard");
};

module.exports.getUsers=async(req,res)=>{
     try{
        const users=await User.find({});
        res.render("admin/userpanel",{users});
        }catch{
            req.flash("error", "Cannot load users.");
            res.redirect("/admin");
        }
};

module.exports.promoteUser=async(req,res)=>{
    try {
    await User.findByIdAndUpdate(req.params.id, { role: "admin" });
    req.flash("success", "User promoted to admin.");
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.redirect("/admin/users");
  }
};

module.exports.demoteUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { role: "user" });
    req.flash("success", "Admin demoted to User.");
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.redirect("/admin/users");
  }
};


module.exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Listing.deleteMany({ owner: req.params.id });
    req.flash("success", "User deleted");
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.redirect("/admin/users");
  }
};