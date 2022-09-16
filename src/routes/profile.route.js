const router = require("express").Router();
const ProfileModel = require("../models/profile.model");
const { validate } = require("../middleware/validation.middleware");
const { createProfile } = require("../services/validation.service");
const { encrypt, decrypt } = require("../services/crypto.service");
const QRCode = require("qrcode");
const { PassThrough } = require("stream");

//Post Method
router.post("/", validate(createProfile), async (req, res) => {
    const newProfile = new ProfileModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    try {
        const profileToSave = await newProfile.save();

        let { firstName, lastName } = profileToSave;

        firstName = Object.values(encrypt(firstName)).join(":");

        lastName = Object.values(encrypt(profileToSave.lastName)).join(":");

        profileToSave.firstName = firstName;
        profileToSave.lastName = lastName;

        // Generate QR Image
        const content = `${firstName} ${lastName}`;

        const qrStream = new PassThrough();

        const result = await QRCode.toFileStream(qrStream, content, {
            type: "png",
            width: 200,
            errorCorrectionLevel: "H",
        });

        // This will return the QR Image containing the encrypted firstName and lastName
        qrStream.pipe(res);

        // This will return the encrypted object
        // res.json(profileToSave);
    } catch (err) {
        res.status(500).send("Failed to return content");
    }
});

//Get by Name Method
router.get("/search", async (req, res) => {
    const profileToFind = {
        [Object.keys(req.query)[0]]: Object.values(req.query)[0],
    };

    try {
        const profile = await ProfileModel.find(profileToFind);
        if (profile.length > 0) {
            res.json(profile);
        } else res.send("User not found");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Get all Method
router.get("/", async (req, res, next) => {
    let { page = 1, pageSize = 25, sort = "" } = req.query;
    let [sortBy, sortMethod] = sort && sort.split(":");
    let sortValue = (sortMethod && sortMethod === "ASC") || "asc" ? 1 : -1;

    try {
        const count = await ProfileModel.countDocuments();

        page = page > Math.ceil(count / pageSize) ? 1 : page;

        let profile = await ProfileModel.find()
            .sort({ [sortBy]: sortValue })
            .limit(pageSize * 1)
            .skip((page - 1) * pageSize)
            .exec();

        res.json({
            profile,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Get by ID Method
router.get("/:id", async (req, res) => {
    try {
        const profile = await ProfileModel.findById(req.params.id);
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Update by ID Method
router.put("/:id", async (req, res) => {
    const profileUpdate = {};

    if (req.body.hasOwnProperty("firstName"))
        profileUpdate.firstName = req.body.firstName;

    if (req.body.hasOwnProperty("lastName"))
        profileUpdate.lastName = req.body.lastName;

    try {
        const profile = await ProfileModel.findByIdAndUpdate(
            req.params.id,
            { $set: profileUpdate },
            { new: true }
        );

        res.send(profile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Delete by ID Method
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const profile = await ProfileModel.findByIdAndDelete(id);

        res.send(`Profile: ${profile} has been deleted..`);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
