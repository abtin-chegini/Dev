const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");
//@route Get api/profile
//@desc Test Route
//@access Public

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(500).json({ msg: "there is no profile for this user" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route Post api/profile
//@desc Test Route
//@access Public
router.post(
  "/",
  auth,
  [
    check("status", "Status is required")
      .not()
      .isEmpty(),
    check("skills", "Skills is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // Skills - Spilt into array
    if (skills) {
      profileFields.skills = req.body.skills
        .split(",")
        .map(skill => skill.trim());
    }
    console.log(profileFields.skills);
    res.send("Hello");
    // Social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update

        if (req.user.id.match(/^[0-9a-fA-F]{24}$/)) {
          profile = await Profile.findByIdAndUpdate(
            { user: String(req.user.id) },
            { $set: profileFields },
            { new: true }
          );
          return res.json(profile);
          // Yes, it's a valid ObjectId, proceed with `findById` call.
        }
      
      }

      //Create Profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(Profile);
    } catch (error) {
      console.error(error);
      resizeTo.status(500).send("server error");
    }
  }
);

module.exports = router;