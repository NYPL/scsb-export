# scsb-export
[![travis](https://travis-ci.org/NYPL/scsb-export.svg)](https://travis-ci.org/NYPL/scsb-export/)

Converts ILS MARC XML export to SCSB middleware schema for the shared collection ReCAP project.

This process expects you have a MARC xml file exported from the ILS export table designed for this process, it will look something [like this](https://github.com/NYPL/scsb-export/blob/master/test/test_has_866.xml) (with more records) and a barcode file that will look something [like this](https://github.com/NYPL/scsb-export/blob/master/test/barcode.test.txt). You run the index.js on these two files and it will produce a XML file in the middleware schema.

To get started

- Install node + npm
- `git clone https://github.com/NYPL/scsb-export.git`
- `npm install`
- run index.js with the parameters --marc for the MARC file and --barcode for the barcode

For example if I wanted to run it on one of the test files I would execute:

```
node index.js --marc "test/test_has_866.xml" --barcode "test/barcode.test.txt" 

```
This will create a new XML file called `test/test_has_866_converted.xml`

The process will log errors to the console and also log them in `data/last_run.log`







 





