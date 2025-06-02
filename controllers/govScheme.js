const cheerio = require('cheerio');
const axios = require('axios');

exports.govSchemeControl = (req, res, next) => {
    // Changed URL to PIB website
    const url = 'https://pib.gov.in/PressReleaseIframePage.aspx?PRID=2002012';
    
    axios.get(url)
        .then((response) => {
            const $ = cheerio.load(response.data);
            const schemes = [];

            // Modified selector to match PIB website table structure
            $('table tr').each((index, element) => {
                // Skip header row
                if (index > 0) {
                    const columns = $(element).find('td');
                    if (columns.length >= 3) {
                        const schemeName = $(columns[1]).text().trim();
                        const description = $(columns[2]).text().trim();
                        
                        // Only add if we have both name and description
                        if (schemeName && description) {
                            schemes.push({ 
                                name: schemeName, 
                                link: '#', // Since direct links aren't available in PIB table
                                description: description 
                            });
                        }
                    }
                }
            });

            // Using the same render call as before
            res.render('scheme/scheme.ejs', {
                pageTitle: 'Government-Scheme',
                path: '/scheme/scheme', 
                schemes: schemes 
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error occurred while fetching schemes');
        });
};