# scsb-export
[![travis](https://travis-ci.org/NYPL/scsb-export.svg)](https://travis-ci.org/NYPL/scsb-export/)

Converts ILS MARC Binary export to SCSB middleware schema for the shared collection ReCAP project.

This process expects you have a MARC binary (.mrc) file exported from the ILS export table designed for this process, here is [how it looks in XML](https://gist.github.com/thisismattmiller/d4869c71eedb8f4e043f42bab576fe2d) (since it is hard to view binary MARC) and a barcode file that will look something [like this](https://github.com/NYPL/scsb-export/blob/master/test/barcode.test.txt). You run the mrc2scsb.js on these two files and it will produce a XML file in the middleware schema.

To get started

- Install node + npm (**requires node 5.x due to an old libxmljs dependency**)
- `git clone https://github.com/NYPL/scsb-export.git`
- `npm install`
- run mrc2scsb.js with the parameters --marc for the MARC file and --barcode for the barcode file and --dupecheck to the path of the temporary dupe check file

For example if I wanted to run it on one of the test files I would execute:

```
node mrc2scsb.js --marc "test/test_multiple_callnumbers.mrc" --barcode "test/barcode.test.txt"  --dupecheck "test/temp_dupecheck.txt"
```

This will create a new XML file called `test/test_multiple_callnumbers.xml` and also a log file called `test/test_multiple_callnumbers.log`

You can also tell it to start or stop if you only want to process X number of records

```
--start 1
--stop 5000
```

Means only process the first 5000 records in the file

Make sure to use the same dupecheck file across the group of marc records, it is a way to enforce cardinality running the script on one file at a time.

---

### API Convert
You must use the Sierra API to convert over the records that broke the 99KB MARC limit. This has to be done after the MRC conversion, because it uses those reports to find the records that had errors.

Edit the api2scsb.js file to point to the reports (if you're operating in ./data, you should be fine) and just run `node api2scsb.js`. Make sure your Sierra API key file is set as well.

---
### Errors
There are a number of errors that can occur and be reported in the log file, here is a list:

`852 missing inumber` - an item's 852 feild is missing its subfield a

`876 missing inumber` - '' 876

`852|b missing` - missing subfield b location code

`876|k missing` - missing subfield k location code

`852 missing` - missing this field for an item

`852 missing` - ''

`Missing barcode: no 876|p` - missing the barcode from the item

`Barcode not found in lookup file` - barcode in item not found int lookup file

`Missing callnumber in items` - something went very wrong, no call number for an item

---

### Tests
`npm test` will run the test suite and also generate the example/test files found in `test/examples/*.mrc`


---

###XML Format
The resulting XML file will not be pretty printed but will be well formed with each `<bibRecord>` on its own line terminated with a `\n`:

```
<?xml version="1.0" ?>
<bibRecords>
  <bibRecord><bib><owningInstitutionId>NYPL</owningInstitutionId>...
  <bibRecord><bib><owningInstitutionId>NYPL</owningInstitutionId>...
  <bibRecord><bib><owningInstitutionId>NYPL</owningInstitutionId>...
  <bibRecord><bib><owningInstitutionId>NYPL</owningInstitutionId>...
  ...
</bibRecords>
  
```

This would allow someone to stream the file line-by-line to access all the records.

 





