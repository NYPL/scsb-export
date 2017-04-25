
## Test 1: Let's build from recap1.mrc

Generate the "_converted" xml from recap1.mrc and a promising looking barcodes CSV I found on the Internet:

### 1. Get Barcodes file

 - Grab https://drive.google.com/open?id=0B51-ZdfMu5sSM1l5ZFd5blhmb3M
 - Unpack and save it to `./data/barcodefile.txt`

### 2. Get .mrc

This one looks good (obtained from KK)
 - Put `recap1.mrc` in `./data/`

### 3. Run it

This takes about 10 minutes:

```
node mrc2scsb.js --marc "data/recap1.mrc" --barcode "data/barcodefile.txt"  --dupecheck "data/temp_dupecheck.txt"
```

Note that `data/temp_dupecheck.txt` needn't exist; The script creates it.

The script outputs a number of messages (see test-run-1.log).

At the end of the process, the target directory (./data) contains:

```
nypl_barcodeFromGFA_20170105054539.csv          
recap1_report_monograph-private-in-library-use-rule-6.csv
recap1.mrc                
recap1_report_monograph-private-in-library-use-rule-no-rule-match.csv
recap1.mrc.log.txt              
recap1_report_monograph-shared-circulates-rule-2.csv
recap1_converted.xml              
recap1_report_monograph-shared-in-library-use-rule-4.csv
recap1_report.txt             
recap1_report_monograph-shared-supervised-use-rule-3.csv
recap1_report_ -private-in-library-use-rule-6.csv     
recap1_report_p-shared-circulates-rule-2.csv
recap1_report_ -private-in-library-use-rule-no-rule-match.csv   
recap1_report_p-shared-in-library-use-rule-4.csv
recap1_report_ -shared-circulates-rule-2.csv        
recap1_report_p-shared-supervised-use-rule-3.csv
recap1_report_ -shared-in-library-use-rule-4.csv      
recap1_report_serial-private-in-library-use-rule-4.csv
recap1_report_ -shared-supervised-use-rule-3.csv      
recap1_report_serial-private-in-library-use-rule-5.csv
recap1_report_collection-private-in-library-use-rule-5.csv    
recap1_report_serial-private-in-library-use-rule-6.csv
recap1_report_collection-private-in-library-use-rule-6.csv    
recap1_report_serial-private-in-library-use-rule-no-rule-match.csv
recap1_report_collection-private-in-library-use-rule-no-rule-match.csv  
recap1_report_serial-private-supervised-use-rule-3.csv
recap1_report_collection-shared-circulates-rule-2.csv     
recap1_report_serial-shared-circulates-rule-2.csv
recap1_report_collection-shared-in-library-use-rule-4.csv   
recap1_report_serial-shared-in-library-use-rule-4.csv
recap1_report_k-shared-in-library-use-rule-4.csv      
recap1_report_serial-shared-supervised-use-rule-3.csv
recap1_report_monoCompPt-private-in-library-use-rule-5.csv    
recap1_report_subunit-private-in-library-use-rule-5.csv
recap1_report_monoCompPt-shared-circulates-rule-2.csv     
recap1_report_subunit-private-in-library-use-rule-no-rule-match.csv
recap1_report_monoCompPt-shared-in-library-use-rule-4.csv   
recap1_report_subunit-shared-in-library-use-rule-4.csv
recap1_report_monograph-private-circulates-rule-2.csv     
recap1_use_report.txt
recap1_report_monograph-private-in-library-use-rule-4.csv   
temp_dupecheck.txt
recap1_report_monograph-private-in-library-use-rule-5.csv
```

### 4. Handle big records

There's a separate script to handle records larger than 90K. It works by crawling the conversion logs created above. One log is created per .mrc. Anything in the log matching '90Kb' indicates a record needs to be fetched via the api directly. Here are the matches in the single log generated above:

```
$ grep -R 90Kb data/
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b100659123
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b101508748
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b103954557
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b105680205
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b105865552
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b107598048
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b108309022
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b10832770x
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b108334831
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b109937326
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b111544385
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b111576222
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b113420912
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b113762392
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b113764984
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b114091249
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b114408014
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b116124441
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b11686199x
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b118005947
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b118020237
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b118104196
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b118105887
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b118113215
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b118114268
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b118115911
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b118116332
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b118242295
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b118301330
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b118327112
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b118384909
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b119959471
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b120536195
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b12609682x
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b126096843
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b126383200
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b126384150
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b126385221
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b12638647x
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b126386481
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b126388003
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b126392821
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b149532398
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b149560515
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b150228272
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b150495158
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b152806349
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b152988178
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b15298835x
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153068176
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153583939
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153585997
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153631843
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153631867
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153631879
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153632136
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153632197
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153771124
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153771161
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153771240
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153771343
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153813507
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153813593
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b153813623
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b15495665x
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b155026859
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b155098457
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b155149246
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b15520676x
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b155412899
data//recap1.mrc.log.txt:MARC Record larger than 90Kb - skipping, .b161773163
```

Here's the result of running api2scsb.js (note I had to change the reports path from `data/reports/recap*.mrc.log.txt` to `data/recap*.mrc.log.txt`).

```
$ node api2scsb.js
Barcode Load: 5230000
Barcodes Loaded
[ 'data/recap1.mrc.log.txt' ]
.b100659123 | 2
.b101508748 | 3
.b103954557 | 4
 .b105680205 | 5
.b105865552 | 6
Missing 876|t,.i316593898
.b107598048 | 7
.b108309022 | 7
Missing barcode: no 876|p, .i110664073 in .b108309022
Missing barcode: no 876|p, .i110664528 in .b108309022
Missing barcode: no 876|p, .i110664772 in .b108309022
.b10832770x | 9
.b108334831 | 10
.b109937326 | 11
.b111544385 | 12
.b111576222 | 12
Missing 876|t,.i111049520
.b113420912 | 14
Missing 876|t,.i280606734
Missing 876|t,.i280701810
.b113762392 | 15
Missing 876|t,.i276690473
.b113764984 | 16
.b114091249 | 17
Missing barcode: no 876|p, .i111316030 in .b114091249
Missing barcode: no 876|p, .i11131611x in .b114091249
Missing barcode: no 876|p, .i111316121 in .b114091249
Missing barcode: no 876|p, .i111316145 in .b114091249
Missing barcode: no 876|p, .i111316169 in .b114091249
Missing barcode: no 876|p, .i111316182 in .b114091249
Duplicate barcode found in single record, 33433008824678, item: .i111317046 in .b114091249
Missing 876|t,.i280559458
.b114408014 | 18
.b116124441 | 19
Non numeric barcode found, 33433001166648 33433001166655, item: .i111517072 in .b116124441
Non numeric barcode found, 33433001166820 33433001166838, item: .i111517242 in .b116124441
Non numeric barcode found, 33433001167059 33433001167067, item: .i111517461 in .b116124441
Non numeric barcode found, 33433001167232 33433001167240 33433001167257, item: .i111517631 in .b116124441
Non numeric barcode found, 33433001167422 33433001167430, item: .i111517801 in .b116124441
Non numeric barcode found, 33433001167513 33433001167497 33433001167505 33433001167521, item: .i111522055 in .b116124441
Non numeric barcode found, 33433001167737 33433001167745 33433001167752, item: .i111522316 in .b116124441
Non numeric barcode found, 33433001167950 33433001167968 33433001167901 33433001167976, item: .i118478631 in .b116124441
Non numeric barcode found, 33433001168149 33433001168156 33433001168164, item: .i118673014 in .b116124441
Non numeric barcode found, 33433001168495 33433001168503, item: .i118673403 in .b116124441
Non numeric barcode found, 33433001169097 33433001169105, item: .i118673919 in .b116124441
Non numeric barcode found, 33433001169063 33433001169071, item: .i11867402x in .b116124441
Non numeric barcode found, 33433001169246 33433001169253 33433001169279 33433001169261 33433001169287, item: .i118674067 in .b116124441
Non numeric barcode found, 33433001169436 33433001169444 33433001169451 33433001169469 33433001169535 33433001169543, item: .i118674213 in .b116124441
Non numeric barcode found, 33433001169683 33433001169691 33433001169709 33433001169717 33433001169725 33433001169733 33433001169741 33433001169758 33433001169766 33433001169774, item: .i118674419 in .b116124441
Non numeric barcode found, 33433001169907 33433001169915 33433001169923 33433001169931 33433001169949 33433001169956 33433001169964, item: .i118674535 in .b116124441
Non numeric barcode found, 33433001169980 33433001169998 33433001170004 33433024222618 33433024222626 33433024222634 33433024222642, item: .i118674547 in .b116124441
Non numeric barcode found, 33433024222782 33433024222790 33433024222808 33433024222816 33433024222824 33433024222832, item: .i118674699 in .b116124441
Non numeric barcode found, 33433024222840 33433024222857 33433024222865 33433024222873 33433024222881 33433024222899, item: .i118674705 in .b116124441
Non numeric barcode found, 33433024223079 33433024223095 33433024223087 33433024223103 33433024223111 33433024223129 33433024223137, item: .i118674882 in .b116124441
Non numeric barcode found, 33433024223145 33433024223152 33433024223160 33433024223178 33433024223186 33433024223194, item: .i118674894 in .b116124441
Non numeric barcode found, 33433020269829 33433020269837, item: .i118675072 in .b116124441
.b11686199x | 20
.b118005947 | 20
.b118020237 | 22
.b118104196 | 23
.b118105887 | 24
.b118113215 | 24
.b118114268 | 26
.b118115911 | 27
.b118116332 | 28
.b118242295 | 29
.b118301330 | 29
.b118327112 | 31
.b118384909 | 32
.b119959471 | 32
.b120536195 | 34
.b12609682x | 34
.b126096843 | 36
.b126383200 | 37
.b126384150 | 38
.b126385221 | 39
.b12638647x | 40
.b126386481 | 41
.b126388003 | 42
.b126392821 | 43
.b149532398 | 43
.b149560515 | 45
.b150228272 | 46
Missing barcode: no 876|p, .i118517776 in .b150228272
.b150495158 | 46
Missing 876|t,.i280606199
.b152806349 | 48
.b152988178 | 49
.b15298835x | 50
.b153068176 | 51
.b153583939 | 52
.b153585997 | 53
.b153631843 | 54
.b153631867 | 55
 .b153631879 | 56
.b153632136 | 57
.b153632197 | 58
.b153771124 | 59
 .b153771161 | 60
.b153771240 | 61
.b153771343 | 62
.b153813507 | 63
Missing 876|t,.i280550546
Missing 876|t,.i280550674
Missing 876|t,.i280550790
Missing 876|t,.i280550844
Missing 876|t,.i280550911
Missing 876|t,.i280550947
Missing 876|t,.i280551113
Missing 876|t,.i280551290
Missing 876|t,.i280551411
.b153813593 | 64
.b153813623 | 65
.b15495665x | 66
.b155026859 | 66
.b155098457 | 68
Missing 876|t,.i118792404
Missing 876|t,.i118792416
Missing 876|t,.i280577886
Missing 876|t,.i280577965
Missing 876|t,.i280578118
Missing 876|t,.i280578568
Missing 876|t,.i280578891
Missing 876|t,.i280579068
Missing 876|t,.i280580812
Missing 876|t,.i28060757x
Missing 876|t,.i280607647
Missing 876|t,.i280607830
Missing 876|t,.i280610269
Missing 876|t,.i280613350
Missing 876|t,.i280629837
Missing 876|t,.i280629849
Missing 876|t,.i280629898
Missing 876|t,.i280629965
Missing 876|t,.i280630141
Missing 876|t,.i280630189
Missing 876|t,.i280630311
Missing 876|t,.i280630335
Missing 876|t,.i280630359
Missing 876|t,.i280630372
.b155149246 | 68
.b15520676x | 70
Missing 876|t,.i28060516x
Missing 876|t,.i280613295
.b155412899 | 70
.b161773163 | 71
```

### 5. Ship it

I assume we now deliver the converted xml files to partners. I assume based on the run above, they'll need:

```
data/large_records_converted.xml
data/recap1_converted.xml
```
