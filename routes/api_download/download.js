import express from 'express';
const router = express.Router();

router.get('/multitrack_zip', (req, res) => {
    var file = __dirname + '/../../public/download/multitrack_zip.zip';
    res.download(file);
});

export default router;