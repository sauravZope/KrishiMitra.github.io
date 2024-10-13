const cheerio = require('cheerio');
const axios = require('axios');

exports.govSchemeControl = (req, res, next) => {
    const url = 'https://vikaspedia.in/schemesall/schemes-for-farmers';
    axios.get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);
            const schemes = [];

            $('#texttospeak a.folderfile_name').each((index, element) => {
                const schemeName = $(element).text().trim();
                const schemeLink = $(element).attr('href');
                schemes.push({ name: schemeName, link: "https://vikaspedia.in" + schemeLink });
            });

            // Render the EJS template with the schemes array
            res.render('scheme/scheme.ejs', {pageTitle: 'Government-Scheme',path: '/scheme/scheme', schemes: schemes });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error occurred');
        });
};
