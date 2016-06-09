/* global describe, it */

'use strict'
var assert = require('assert') // eslint-disable-line
var should = require('should') // eslint-disable-line
var parsLib = require('../lib/parse.js')

var xml2js = require('xml2js')
var builder = new xml2js.Builder({headless: true})

var testXMLno001 = '<marc:record><marc:leader>01457cas a2200421   4500</marc:leader><marc:controlfield tag="005">20000925124545.5</marc:controlfield><marc:controlfield tag="008">810601d19771982qucfx p   o   0   a0eng d</marc:controlfield><marc:datafield ind1=" " ind2=" " tag="010"><marc:subfield code="a">80642517 </marc:subfield><marc:subfield code="z">CE78030455</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="015"><marc:subfield code="a">C 780304551E</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="022"><marc:subfield code="a">0703-1874</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="035"><marc:subfield code="a">(WaOLN)nyp0211011</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="037"><marc:subfield code="b">I C E S, P.O. Box 8888, Station A, Montreal, Que. H3C 3P8</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="040"><marc:subfield code="a">CaOONL</marc:subfield><marc:subfield code="b">eng</marc:subfield><marc:subfield code="c">CaOONL</marc:subfield><marc:subfield code="d">DLC</marc:subfield><marc:subfield code="d">m.c.</marc:subfield><marc:subfield code="d">CaOONL</marc:subfield><marc:subfield code="d">NN</marc:subfield><marc:subfield code="d">WaOLN</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="041"><marc:subfield code="a">eng</marc:subfield><marc:subfield code="a">fre</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="042"><marc:subfield code="a">isds/c</marc:subfield><marc:subfield code="a">lc</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="043"><marc:subfield code="a">e------</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="0" tag="050"><marc:subfield code="a">D901</marc:subfield><marc:subfield code="b">.E85</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="1" tag="055"><marc:subfield code="a">D1050</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="0" tag="082"><marc:subfield code="a">940/.05</marc:subfield><marc:subfield code="a">905</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="130"><marc:subfield code="a">Europa (Montréal, Québec)</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2="0" tag="222"><marc:subfield code="a">Europa</marc:subfield><marc:subfield code="b">(Montreal)</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="0" tag="245"><marc:subfield code="a">Europa.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="260"><marc:subfield code="a">[Montréal]</marc:subfield><marc:subfield code="b">Inter-University Centre for European Studies.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="300"><marc:subfield code="a">5 v.</marc:subfield><marc:subfield code="c">25 cm.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="310"><marc:subfield code="a">Two no. a year</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="362"><marc:subfield code="a">t. 1-5; Nov. 1977-1982.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="500"><marc:subfield code="a">&quot;A journal of interdisciplinary studies&quot;.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="546"><marc:subfield code="a">Text in English or French, with summaries in the other language.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2="0" tag="651"><marc:subfield code="a">Europe</marc:subfield><marc:subfield code="v">Periodicals.</marc:subfield></marc:datafield><marc:datafield ind1="2" ind2=" " tag="710"><marc:subfield code="a">Centre interuniversitaire d\'études européennes.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100054535</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-134</marc:subfield><marc:subfield code="3">v. 1-2 1977-79</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100054547</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-134</marc:subfield><marc:subfield code="3">v. 3-5 Autumn 1979-1982</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100054535</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433005305200</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100054547</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433005266097</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="907"><marc:subfield code="a">.b100110381</marc:subfield><marc:subfield code="c">s</marc:subfield><marc:subfield code="d">a</marc:subfield><marc:subfield code="e">-</marc:subfield><marc:subfield code="f">eng</marc:subfield><marc:subfield code="g">quc</marc:subfield><marc:subfield code="h">0</marc:subfield><marc:subfield code="i">2</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="952"><marc:subfield code="h">JFL 81-134</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="991"><marc:subfield code="y">3956490</marc:subfield></marc:datafield></marc:record>' // eslint-disable-line
var testXMLno001andNo991 = '<marc:record><marc:leader>01457cas a2200421   4500</marc:leader><marc:controlfield tag="005">20000925124545.5</marc:controlfield><marc:controlfield tag="008">810601d19771982qucfx p   o   0   a0eng d</marc:controlfield><marc:datafield ind1=" " ind2=" " tag="010"><marc:subfield code="a">80642517 </marc:subfield><marc:subfield code="z">CE78030455</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="015"><marc:subfield code="a">C 780304551E</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="022"><marc:subfield code="a">0703-1874</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="035"><marc:subfield code="a">(WaOLN)nyp0211011</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="037"><marc:subfield code="b">I C E S, P.O. Box 8888, Station A, Montreal, Que. H3C 3P8</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="040"><marc:subfield code="a">CaOONL</marc:subfield><marc:subfield code="b">eng</marc:subfield><marc:subfield code="c">CaOONL</marc:subfield><marc:subfield code="d">DLC</marc:subfield><marc:subfield code="d">m.c.</marc:subfield><marc:subfield code="d">CaOONL</marc:subfield><marc:subfield code="d">NN</marc:subfield><marc:subfield code="d">WaOLN</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="041"><marc:subfield code="a">eng</marc:subfield><marc:subfield code="a">fre</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="042"><marc:subfield code="a">isds/c</marc:subfield><marc:subfield code="a">lc</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="043"><marc:subfield code="a">e------</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="0" tag="050"><marc:subfield code="a">D901</marc:subfield><marc:subfield code="b">.E85</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="1" tag="055"><marc:subfield code="a">D1050</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="0" tag="082"><marc:subfield code="a">940/.05</marc:subfield><marc:subfield code="a">905</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="130"><marc:subfield code="a">Europa (Montréal, Québec)</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2="0" tag="222"><marc:subfield code="a">Europa</marc:subfield><marc:subfield code="b">(Montreal)</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="0" tag="245"><marc:subfield code="a">Europa.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="260"><marc:subfield code="a">[Montréal]</marc:subfield><marc:subfield code="b">Inter-University Centre for European Studies.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="300"><marc:subfield code="a">5 v.</marc:subfield><marc:subfield code="c">25 cm.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="310"><marc:subfield code="a">Two no. a year</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="362"><marc:subfield code="a">t. 1-5; Nov. 1977-1982.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="500"><marc:subfield code="a">&quot;A journal of interdisciplinary studies&quot;.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="546"><marc:subfield code="a">Text in English or French, with summaries in the other language.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2="0" tag="651"><marc:subfield code="a">Europe</marc:subfield><marc:subfield code="v">Periodicals.</marc:subfield></marc:datafield><marc:datafield ind1="2" ind2=" " tag="710"><marc:subfield code="a">Centre interuniversitaire d\'études européennes.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100054535</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-134</marc:subfield><marc:subfield code="3">v. 1-2 1977-79</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100054547</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-134</marc:subfield><marc:subfield code="3">v. 3-5 Autumn 1979-1982</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100054535</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433005305200</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100054547</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433005266097</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="907"><marc:subfield code="a">.b100110381</marc:subfield><marc:subfield code="c">s</marc:subfield><marc:subfield code="d">a</marc:subfield><marc:subfield code="e">-</marc:subfield><marc:subfield code="f">eng</marc:subfield><marc:subfield code="g">quc</marc:subfield><marc:subfield code="h">0</marc:subfield><marc:subfield code="i">2</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="952"><marc:subfield code="h">JFL 81-134</marc:subfield></marc:datafield></marc:record>' // eslint-disable-line
var testXMLnormal = '<marc:record><marc:leader>01457cas a2200421   4500</marc:leader><marc:controlfield tag="001">NYPG0119-S</marc:controlfield><marc:controlfield tag="005">20000925124545.5</marc:controlfield><marc:controlfield tag="008">810601d19771982qucfx p   o   0   a0eng d</marc:controlfield><marc:datafield ind1=" " ind2=" " tag="010"><marc:subfield code="a">80642517 </marc:subfield><marc:subfield code="z">CE78030455</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="015"><marc:subfield code="a">C 780304551E</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="022"><marc:subfield code="a">0703-1874</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="035"><marc:subfield code="a">(WaOLN)nyp0211011</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="037"><marc:subfield code="b">I C E S, P.O. Box 8888, Station A, Montreal, Que. H3C 3P8</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="040"><marc:subfield code="a">CaOONL</marc:subfield><marc:subfield code="b">eng</marc:subfield><marc:subfield code="c">CaOONL</marc:subfield><marc:subfield code="d">DLC</marc:subfield><marc:subfield code="d">m.c.</marc:subfield><marc:subfield code="d">CaOONL</marc:subfield><marc:subfield code="d">NN</marc:subfield><marc:subfield code="d">WaOLN</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="041"><marc:subfield code="a">eng</marc:subfield><marc:subfield code="a">fre</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="042"><marc:subfield code="a">isds/c</marc:subfield><marc:subfield code="a">lc</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="043"><marc:subfield code="a">e------</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="0" tag="050"><marc:subfield code="a">D901</marc:subfield><marc:subfield code="b">.E85</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="1" tag="055"><marc:subfield code="a">D1050</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="0" tag="082"><marc:subfield code="a">940/.05</marc:subfield><marc:subfield code="a">905</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="130"><marc:subfield code="a">Europa (Montréal, Québec)</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2="0" tag="222"><marc:subfield code="a">Europa</marc:subfield><marc:subfield code="b">(Montreal)</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="0" tag="245"><marc:subfield code="a">Europa.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="260"><marc:subfield code="a">[Montréal]</marc:subfield><marc:subfield code="b">Inter-University Centre for European Studies.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="300"><marc:subfield code="a">5 v.</marc:subfield><marc:subfield code="c">25 cm.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="310"><marc:subfield code="a">Two no. a year</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="362"><marc:subfield code="a">t. 1-5; Nov. 1977-1982.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="500"><marc:subfield code="a">&quot;A journal of interdisciplinary studies&quot;.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="546"><marc:subfield code="a">Text in English or French, with summaries in the other language.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2="0" tag="651"><marc:subfield code="a">Europe</marc:subfield><marc:subfield code="v">Periodicals.</marc:subfield></marc:datafield><marc:datafield ind1="2" ind2=" " tag="710"><marc:subfield code="a">Centre interuniversitaire détudes européennes.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100054535</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-134</marc:subfield><marc:subfield code="3">v. 1-2 1977-79</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100054547</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-134</marc:subfield><marc:subfield code="3">v. 3-5 Autumn 1979-1982</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100054535</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433005305200</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100054547</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433005266097</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="907"><marc:subfield code="a">.b100110381</marc:subfield><marc:subfield code="c">s</marc:subfield><marc:subfield code="d">a</marc:subfield><marc:subfield code="e">-</marc:subfield><marc:subfield code="f">eng</marc:subfield><marc:subfield code="g">quc</marc:subfield><marc:subfield code="h">0</marc:subfield><marc:subfield code="i">2</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="952"><marc:subfield code="h">JFL 81-134</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="991"><marc:subfield code="y">3956490</marc:subfield></marc:datafield></marc:record>'
var testXMLhas866 = '<marc:record><marc:leader>02626cas a2200589   4500</marc:leader><marc:controlfield tag="001">NYPG0122-S</marc:controlfield><marc:controlfield tag="005">20000925124422.1</marc:controlfield><marc:controlfield tag="008">810601c19789999ne qr p       0    0eng d</marc:controlfield><marc:datafield ind1=" " ind2=" " tag="010"><marc:subfield code="a">sc 79005623 </marc:subfield><marc:subfield code="z">79009626 /sn</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="022"><marc:subfield code="a">0165-0254</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="035"><marc:subfield code="a">(WaOLN)nyp0011759</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="035"><marc:subfield code="a">(WaOLN)nyp0000040</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="040"><marc:subfield code="a">CLU</marc:subfield><marc:subfield code="c">CLU</marc:subfield><marc:subfield code="d">CU-CU</marc:subfield><marc:subfield code="d">DNLM</marc:subfield><marc:subfield code="d">OCL</marc:subfield><marc:subfield code="d">NSDP</marc:subfield><marc:subfield code="d">DLC</marc:subfield><marc:subfield code="d">NN</marc:subfield><marc:subfield code="d">WaOLN</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="042"><marc:subfield code="a">lc</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="210"><marc:subfield code="a">Int. j. behav. dev.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2="0" tag="222"><marc:subfield code="a">International journal of behavioral development</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="0" tag="245"><marc:subfield code="a">International journal of behavioral development.</marc:subfield></marc:datafield><marc:datafield ind1="3" ind2="3" tag="246"><marc:subfield code="a">IJBD</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="260"><marc:subfield code="a">Amsterdam,</marc:subfield><marc:subfield code="b">North-Holland.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="300"><marc:subfield code="a">v.</marc:subfield><marc:subfield code="b">ill.</marc:subfield><marc:subfield code="c">24 cm.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="310"><marc:subfield code="a">Quarterly</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="362"><marc:subfield code="a">v. 1-   Jan. 1978-</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="550"><marc:subfield code="a">Official journal of the International Society for the Study of Behavioral Development.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2="0" tag="650"><marc:subfield code="a">Etiquette</marc:subfield><marc:subfield code="v">Periodicals.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2="0" tag="650"><marc:subfield code="a">Developmental psychology</marc:subfield><marc:subfield code="v">Periodicals.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2="0" tag="650"><marc:subfield code="a">Behaviorism (psychology)</marc:subfield><marc:subfield code="v">Periodicals.</marc:subfield></marc:datafield><marc:datafield ind1="2" ind2=" " tag="710"><marc:subfield code="a">International Society for the Study of Behavioral Development.</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="799"><marc:subfield code="a">Gift of the DeWitt Wallace Endowment Fund, named in honor of the founder of Reader s Digest</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100057615</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-124</marc:subfield><marc:subfield code="3">v. 1-2 1978-79</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100057627</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-124</marc:subfield><marc:subfield code="3">v. 3-4 1980-81</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100057639</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-124</marc:subfield><marc:subfield code="3">v. 5-6 1982-83</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100057640</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-124</marc:subfield><marc:subfield code="3">v. 7 1984</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100057652</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-124</marc:subfield><marc:subfield code="3">v. 8 1985</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i137858930</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-124</marc:subfield><marc:subfield code="3">v. 24 (2000)</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i174473692</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-124</marc:subfield><marc:subfield code="3">v. 28 (2004)</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i174473709</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-124</marc:subfield><marc:subfield code="3">v. 25 (2001)</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i174473710</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-124</marc:subfield><marc:subfield code="3">v. 26 (2002)</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i174473722</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">JFL 81-124</marc:subfield><marc:subfield code="3">v. 27 (2003)</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="866"><marc:subfield code="a">1(1978)-8(1985), 24(2000)-34:1(2010).</marc:subfield><marc:subfield code="y">.c10823153</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100057615</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433005304443</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100057627</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433005304450</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100057639</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433005304468</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100057640</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433005304476</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100057652</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433005304484</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i137858930</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433057526539</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i174473692</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433079115196</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i174473709</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433079115451</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i174473710</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433079115469</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i174473722</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433079115477</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">3</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="907"><marc:subfield code="a">.b100117454</marc:subfield><marc:subfield code="c">s</marc:subfield><marc:subfield code="d">a</marc:subfield><marc:subfield code="e">-</marc:subfield><marc:subfield code="f">eng</marc:subfield><marc:subfield code="g">ne </marc:subfield><marc:subfield code="h">0</marc:subfield><marc:subfield code="i">43</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="952"><marc:subfield code="h">JFL 81-124</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="991"><marc:subfield code="y">4131153</marc:subfield></marc:datafield></marc:record>'
var testXMLMultiItems = '	<marc:record><marc:leader>01566cam a2200325 a 4500</marc:leader><marc:controlfield tag="001">NYPG017000254-B</marc:controlfield><marc:controlfield tag="005">20001116192630.3</marc:controlfield><marc:controlfield tag="008">880317m19561957gw ac    b    000 0 wen d</marc:controlfield><marc:datafield ind1=" " ind2=" " tag="035"><marc:subfield code="a">NNSZ01718974</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="035"><marc:subfield code="a">(WaOLN)nyp0215641</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="040"><marc:subfield code="a">NN</marc:subfield><marc:subfield code="c">NN</marc:subfield><marc:subfield code="d">WaOLN</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="043"><marc:subfield code="a">e-ge---</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2="0" tag="245"><marc:subfield code="a">Chrestomatija dolnoserbskego pismowstwa /</marc:subfield><marc:subfield code="c">zběrał, zestajał a literarhistoriski wobźěłał Frido Mětšk.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="260"><marc:subfield code="a">Berlin :</marc:subfield><marc:subfield code="b">Volk und Wissen,</marc:subfield><marc:subfield code="c">1956-1957.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="300"><marc:subfield code="a">2 v. :</marc:subfield><marc:subfield code="b">ill., ports. ;</marc:subfield><marc:subfield code="c">22cm.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="504"><marc:subfield code="a">Bibliography: v.2, p. 456-457.</marc:subfield></marc:datafield><marc:datafield ind1="0" ind2=" " tag="505"><marc:subfield code="a">1. zw.  Pokazki z dolnoserbskeje literatury ze zachopjeńka až do casa serbskego wozroźenja -- 2 zw. Pokazki z dolnoserbskeje literatury w imperialistiskej Němskej.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2="0" tag="650"><marc:subfield code="a">Sorbian literature</marc:subfield><marc:subfield code="z">Germany (East)</marc:subfield><marc:subfield code="z">Lower Lusatia.</marc:subfield></marc:datafield><marc:datafield ind1="1" ind2=" " tag="700"><marc:subfield code="a">Mětšk, Frido.</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100075356</marc:subfield><marc:subfield code="b">rc2ma</marc:subfield><marc:subfield code="h">*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)</marc:subfield><marc:subfield code="3">v. 2  1957</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100075332</marc:subfield><marc:subfield code="b">rcma2</marc:subfield><marc:subfield code="h">*QX 86-6584</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i100075344</marc:subfield><marc:subfield code="b">rcma2</marc:subfield><marc:subfield code="h">*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)</marc:subfield><marc:subfield code="3">v. 1  1956</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="852"><marc:subfield code="a">.i109425005</marc:subfield><marc:subfield code="b">rcma2</marc:subfield><marc:subfield code="h">*QX 86-6584</marc:subfield><marc:subfield code="y">214</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100075356</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rc2ma</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433002525362</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">2</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100075332</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rcma2</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433002521189</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">2</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i100075344</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rcma2</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433002525354</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">2</marc:subfield><marc:subfield code="y">2</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="876"><marc:subfield code="a">.i109425005</marc:subfield><marc:subfield code="j">-</marc:subfield><marc:subfield code="k">rcma2</marc:subfield><marc:subfield code="o">2</marc:subfield><marc:subfield code="p">33433021467638</marc:subfield><marc:subfield code="s">214</marc:subfield><marc:subfield code="t">1</marc:subfield><marc:subfield code="y">2</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="907"><marc:subfield code="a">.b100156885</marc:subfield><marc:subfield code="c">m</marc:subfield><marc:subfield code="d">a</marc:subfield><marc:subfield code="e">-</marc:subfield><marc:subfield code="f">wen</marc:subfield><marc:subfield code="g">gw </marc:subfield><marc:subfield code="h">0</marc:subfield><marc:subfield code="i">4</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="952"><marc:subfield code="h">*QX 86-6584</marc:subfield></marc:datafield><marc:datafield ind1=" " ind2=" " tag="952"><marc:subfield code="h">*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)</marc:subfield></marc:datafield></marc:record>'

describe('mapUtils lib/utils.js', function () {
  it('It should load the barcode file into memeory', function (done) {
    this.timeout(500000)
    parsLib.loadBarcodes('test/barcode.test.txt', () => {
      parsLib.barcodes.get(33433019861248).should.equal('JN')
      parsLib.barcodes.get(33433003661778).should.equal('NA')
      done()
    })
  })

  it('It should extract data from the datafields MARC field 001 present', function (done) {
    parsLib.parse(testXMLnormal, (err, jsObj) => {
      if (err) console.log(err)
      var data = parsLib.extractData(jsObj)
      data.has001ControlNumber.should.equal('NYPG0119-S')
      done()
    })
  })
  it('It should extract data from the datafields MARC field 001 missing', function (done) {
    parsLib.parse(testXMLno001, (err, jsObj) => {
      if (err) console.log(err)
      var data = parsLib.extractData(jsObj)
      data.has001ControlNumber.should.equal(false)
      data.has001ControlNumber907a.should.equal('.b100110381')
      data.has001ControlNumber991y.should.equal('3956490')
      done()
    })
  })
  it('It should extract data from the datafields MARC field 907|a', function (done) {
    parsLib.parse(testXMLnormal, (err, jsObj) => {
      if (err) console.log(err)
      var data = parsLib.extractData(jsObj)
      data.has001ControlNumber907a.should.equal('.b100110381')
      done()
    })
  })
  it('It should extract data from the datafields MARC field 991|y', function (done) {
    parsLib.parse(testXMLnormal, (err, jsObj) => {
      if (err) console.log(err)
      var data = parsLib.extractData(jsObj)
      data.has001ControlNumber991y.should.equal('3956490')
      done()
    })
  })
  it('It should create a new 001 field when it is missing from the record using the 991|y', function (done) {
    parsLib.parse(testXMLno001, (err, jsObj) => {
      if (err) console.log(err)
      var data = parsLib.extractData(jsObj)
      var has001 = false
      var has003 = false
      data.recordControlFields.forEach((cf) => {
        if (cf['$'].tag === '001') has001 = cf._
        if (cf['$'].tag === '003') has003 = cf._
      })
      has001.should.equal('3956490')
      has003.should.equal('OCoLC')

      done()
    })
  })
  it('It should create a new 001 field when it is missing from the record using the 907|a', function (done) {
    parsLib.parse(testXMLno001andNo991, (err, jsObj) => {
      if (err) console.log(err)
      var data = parsLib.extractData(jsObj)
      var has001 = false
      data.recordControlFields.forEach((cf) => {
        if (cf['$'].tag === '001') has001 = cf._
      })
      has001.should.equal('NYPL.b100110381')
      done()
    })
  })

  it('It should extract 852 data', function (done) {
    parsLib.parse(testXMLno001andNo991, (err, jsObj) => {
      if (err) console.log(err)
      var data = parsLib.extractData(jsObj)
      var has001 = false
      data.recordControlFields.forEach((cf) => {
        if (cf['$'].tag === '001') has001 = cf._
      })
      data.fakeHoldings852TextHoldings['JFL 81-134'][0].should.equal('v. 1-2 1977-79')
      data.fakeHoldings852TextHoldings['JFL 81-134'][1].should.equal('v. 3-5 Autumn 1979-1982')
      data.fakeHoldings852Locations['JFL 81-134'][0].should.equal('rc2ma')
      has001.should.equal('NYPL.b100110381')
      done()
    })
  })
  it('It should extract 876 data', function (done) {
    parsLib.parse(testXMLnormal, (err, jsObj) => {
      if (err) console.log(err)
      var data = parsLib.extractData(jsObj)
      data.item876Data['.i100054535'].o.should.equal('2')
      data.item876Data['.i100054535'].s.should.equal('214')
      data.item876Data['.i100054535'].y.should.equal('3')
      done()
    })
  })
  it('It should store the bib level call number', function (done) {
    parsLib.parse(testXMLno001andNo991, (err, jsObj) => {
      if (err) console.log(err)
      var data = parsLib.extractData(jsObj)
      data.bibCallNumber[0].should.equal('JFL 81-134')
      done()
    })
  })
  it('It should build items from the item data', function (done) {
    parsLib.parse(testXMLMultiItems, (err, jsObj) => {
      if (err) console.log(err)
      var data = parsLib.extractData(jsObj)
      var check = {}
      data.items['*QX 86-6584'][0]['876'].subfield.forEach((sf) => {
        check[sf['$'].code] = sf._
      })
      check.p.should.equal('33433002521189')
      check.a.should.equal('.i100075332')
      check.j.should.equal('-')
      check.t.should.equal('1')
      done()
    })
  })
  it('It should build the holdings based on the items available when there is a 866', function (done) {
    parsLib.parse(testXMLhas866, (err, jsObj) => {
      if (err) console.log(err)
      var data = parsLib.extractData(jsObj)
      data.holdingsXmlObj[0].owningInstitutionHoldingsId.should.equal('.c10823153')
      var xml = builder.buildObject(data.holdingsXmlObj)
      xml.split('tag="876"').length.should.equal(11)
      xml.split('tag="900"').length.should.equal(11)
      xml.split('<items>').length.should.equal(2)
      done()
    })
  })
  it('It should build the holdings based on the items available when there is not a 866', function (done) {
    parsLib.parse(testXMLMultiItems, (err, jsObj) => {
      if (err) console.log(err)
      var data = parsLib.extractData(jsObj)
      var xml = builder.buildObject(data.holdingsXmlObj)
      xml.split('tag="876"').length.should.equal(5)
      xml.split('tag="900"').length.should.equal(5)
      xml.split('<items>').length.should.equal(3)
      done()
    })
  })

  it('Use restriction generation - blank (criculates)', function () {
    var data852 = {
      3: 'v. 1  1956',
      b: 'rcma2',
      h: '*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)'
    }
    // $o = 2
    // $s = 211, 212, 210, 214, 215, 227
    // $y = 55 or 57
    var data876 = {
      o: '2',
      s: '211',
      y: '55',
      a: '.i100075344',
      j: '-',
      p: '33433002525354',
      t: '2'
    }
    var r = parsLib.buildUseRestriction(data852, data876, 'GN')
    r.useRestriction.should.equal('')
    r.groupDesignation.should.equal('Shared')
  })

  it('Use restriction generation - Supervised Use', function () {
    var data852 = {
      3: 'v. 1  1956',
      b: 'rcma2',
      h: '*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)'
    }
    // $o = 4, a, p, u
    // $s = 211, 212, 210, 214, 215, 227

    var data876 = {
      o: 4,
      s: '211',
      y: '55',
      a: '.i100075344',
      j: '-',
      p: '33433002525354',
      t: '2'
    }
    var r = parsLib.buildUseRestriction(data852, data876, 'ND')
    r.useRestriction.should.equal('Supervised Use')
    r.groupDesignation.should.equal('Private')
  })

  it('Use restriction generation - In Library Use', function () {
    var data852 = {
      3: 'v. 1  1956',
      b: 'rcma2',
      h: '*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)'
    }
    // $o = 2
    // $s = 211, 212, 210, 214, 215, 227
    // $y = 2, 3, 4, 5, 6, 7, 25, 26, 32, 33, 34, 35, 42, 43, 52, 53, 60, 61, 65, 67
    var data876 = {
      o: 2,
      s: '227',
      y: '43',
      a: '.i100075344',
      j: '-',
      p: '33433002525354',
      t: '2'
    }
    var r = parsLib.buildUseRestriction(data852, data876, 'ND')
    r.useRestriction.should.equal('In Library Use')
    r.groupDesignation.should.equal('Private')
  })

  it('Use restriction generation - Supervised Use 2', function () {
    var data852 = {
      3: 'v. 1  1956',
      b: 'rcma2',
      h: '*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)'
    }
    // $o = 2
    // $s = 213, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 228, 230

    var data876 = {
      o: 2,
      s: '226',
      y: '43',
      a: '.i100075344',
      j: '-',
      p: '33433002525354',
      t: '2'
    }
    var r = parsLib.buildUseRestriction(data852, data876, 'JS')
    r.useRestriction.should.equal('Supervised Use')
    r.groupDesignation.should.equal('Shared')
  })

  it('Use restriction generation - Catch all', function () {
    var data852 = {
      3: 'v. 1  1956',
      b: 'rcma2',
      h: '*QX (Mětšk, F. Chrestomatija dolnoserbskego pismowstwa)'
    }
    var data876 = {
      o: 2,
      s: '68',
      y: '43',
      a: '.i100075344',
      j: '-',
      p: '33433002525354',
      t: '2'
    }
    var r = parsLib.buildUseRestriction(data852, data876, 'JS')
    r.useRestriction.should.equal('Supervised Use')
    r.groupDesignation.should.equal('Shared')
  })

  it('Use restriction generation - Catch all 2', function () {
    var data852 = { '3': false, b: 'rcma2', h: false }
    var data876 = { o: '2',
      s: '3333',
      y: '2',
      a: '.i100005184',
      j: '-',
      p: '33433014514305',
    t: '1' }

    var r = parsLib.buildUseRestriction(data852, data876, 'JS')
    r.useRestriction.should.equal('Supervised Use')
    r.groupDesignation.should.equal('Shared')
  })
})
