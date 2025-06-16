const nseFoNames = [
  {
    name: "JSW STEEL LIMITED",
    asset_key: "NSE_EQ|INE019A01038",
  },
  {
    name: "HINDUSTAN ZINC LIMITED",
    asset_key: "NSE_EQ|INE267A01025",
  },
  {
    name: "VARUN BEVERAGES LIMITED",
    asset_key: "NSE_EQ|INE200M01039",
  },
  {
    name: "NIFTY",
    asset_key: "NSE_INDEX|Nifty 50",
  },
  {
    name: "ADANI ENERGY SOLUTION LTD",
    asset_key: "NSE_EQ|INE931S01010",
  },
  {
    name: "COFORGE LIMITED",
    asset_key: "NSE_EQ|INE591G01025",
  },
  {
    name: "GRANULES INDIA LIMITED",
    asset_key: "NSE_EQ|INE101D01020",
  },
  {
    name: "SRF LTD",
    asset_key: "NSE_EQ|INE647A01010",
  },
  {
    name: "COLGATE PALMOLIVE LTD.",
    asset_key: "NSE_EQ|INE259A01022",
  },
  {
    name: "OBEROI REALTY LIMITED",
    asset_key: "NSE_EQ|INE093I01010",
  },
  {
    name: "SBI CARDS & PAY SER LTD",
    asset_key: "NSE_EQ|INE018E01016",
  },
  {
    name: "ACC LIMITED",
    asset_key: "NSE_EQ|INE012A01025",
  },
  {
    name: "DABUR INDIA LTD",
    asset_key: "NSE_EQ|INE016A01026",
  },
  {
    name: "ICICI BANK LTD.",
    asset_key: "NSE_EQ|INE090A01021",
  },
  {
    name: "VEDANTA LIMITED",
    asset_key: "NSE_EQ|INE205A01025",
  },
  {
    name: "MAX FINANCIAL SERV LTD",
    asset_key: "NSE_EQ|INE180A01020",
  },
  {
    name: "IDFC FIRST BANK LIMITED",
    asset_key: "NSE_EQ|INE092T01019",
  },
  {
    name: "SBI LIFE INSURANCE CO LTD",
    asset_key: "NSE_EQ|INE123W01016",
  },
  {
    name: "MRF LTD",
    asset_key: "NSE_EQ|INE883A01011",
  },
  {
    name: "GODREJ PROPERTIES LTD",
    asset_key: "NSE_EQ|INE484J01027",
  },
  {
    name: "ADITYA BIRLA FASHION & RT",
    asset_key: "NSE_EQ|INE647O01011",
  },
  {
    name: "CYIENT LIMITED",
    asset_key: "NSE_EQ|INE136B01020",
  },
  {
    name: "FINNIFTY",
    asset_key: "NSE_INDEX|Nifty Fin Service",
  },
  {
    name: "ADANI GREEN ENERGY LTD",
    asset_key: "NSE_EQ|INE364U01010",
  },
  {
    name: "STATE BANK OF INDIA",
    asset_key: "NSE_EQ|INE062A01020",
  },
  {
    name: "BALKRISHNA IND. LTD",
    asset_key: "NSE_EQ|INE787D01026",
  },
  {
    name: "BAJAJ FINSERV LTD.",
    asset_key: "NSE_EQ|INE918I01026",
  },
  {
    name: "DALMIA BHARAT LIMITED",
    asset_key: "NSE_EQ|INE00R701025",
  },
  {
    name: "VOLTAS LTD",
    asset_key: "NSE_EQ|INE226A01021",
  },
  {
    name: "AU SMALL FINANCE BANK LTD",
    asset_key: "NSE_EQ|INE949L01017",
  },
  {
    name: "GODREJ CONSUMER PRODUCTS",
    asset_key: "NSE_EQ|INE102D01028",
  },
  {
    name: "ADANI ENTERPRISES LIMITED",
    asset_key: "NSE_EQ|INE423A01024",
  },
  {
    name: "SUN PHARMACEUTICAL IND L",
    asset_key: "NSE_EQ|INE044A01036",
  },
  {
    name: "SHREE CEMENT LIMITED",
    asset_key: "NSE_EQ|INE070A01015",
  },
  {
    name: "ORACLE FIN SERV SOFT LTD.",
    asset_key: "NSE_EQ|INE881D01027",
  },
  {
    name: "LTIMINDTREE LIMITED",
    asset_key: "NSE_EQ|INE214T01019",
  },
  {
    name: "BANK OF BARODA",
    asset_key: "NSE_EQ|INE028A01039",
  },
  {
    name: "BSE LIMITED",
    asset_key: "NSE_EQ|INE118H01025",
  },
  {
    name: "INDUSIND BANK LIMITED",
    asset_key: "NSE_EQ|INE095A01012",
  },
  {
    name: "BAJAJ FINANCE LIMITED",
    asset_key: "NSE_EQ|INE296A01032",
  },
  {
    name: "JUBILANT FOODWORKS LTD",
    asset_key: "NSE_EQ|INE797F01020",
  },
  {
    name: "OIL INDIA LTD",
    asset_key: "NSE_EQ|INE274J01014",
  },
  {
    name: "ADANI PORT & SEZ LTD",
    asset_key: "NSE_EQ|INE742F01042",
  },
  {
    name: "GRASIM INDUSTRIES LTD",
    asset_key: "NSE_EQ|INE047A01021",
  },
  {
    name: "LUPIN LIMITED",
    asset_key: "NSE_EQ|INE326A01037",
  },
  {
    name: "BANDHAN BANK LIMITED",
    asset_key: "NSE_EQ|INE545U01014",
  },
  {
    name: "AXIS BANK LIMITED",
    asset_key: "NSE_EQ|INE238A01034",
  },
  {
    name: "CENTRAL DEPO SER (I) LTD",
    asset_key: "NSE_EQ|INE736A01011",
  },
  {
    name: "KALYAN JEWELLERS IND LTD",
    asset_key: "NSE_EQ|INE303R01014",
  },
  {
    name: "OIL AND NATURAL GAS CORP.",
    asset_key: "NSE_EQ|INE213A01029",
  },
  {
    name: "BIRLASOFT LIMITED",
    asset_key: "NSE_EQ|INE836A01035",
  },
  {
    name: "BHARAT ELECTRONICS LTD",
    asset_key: "NSE_EQ|INE263A01024",
  },
  {
    name: "TRENT LTD",
    asset_key: "NSE_EQ|INE849A01020",
  },
  {
    name: "CANARA BANK",
    asset_key: "NSE_EQ|INE476A01022",
  },
  {
    name: "HINDUSTAN AERONAUTICS LTD",
    asset_key: "NSE_EQ|INE066F01020",
  },
  {
    name: "AUROBINDO PHARMA LTD",
    asset_key: "NSE_EQ|INE406A01037",
  },
  {
    name: "TVS MOTOR COMPANY  LTD",
    asset_key: "NSE_EQ|INE494B01023",
  },
  {
    name: "RELIANCE INDUSTRIES LTD",
    asset_key: "NSE_EQ|INE002A01018",
  },
  {
    name: "BANK OF INDIA",
    asset_key: "NSE_EQ|INE084A01016",
  },
  {
    name: "PIDILITE INDUSTRIES LTD",
    asset_key: "NSE_EQ|INE318A01026",
  },
  {
    name: "DELHIVERY LIMITED",
    asset_key: "NSE_EQ|INE148O01028",
  },
  {
    name: "ULTRATECH CEMENT LIMITED",
    asset_key: "NSE_EQ|INE481G01011",
  },
  {
    name: "KEI INDUSTRIES LTD.",
    asset_key: "NSE_EQ|INE878B01027",
  },
  {
    name: "CHOLAMANDALAM IN & FIN CO",
    asset_key: "NSE_EQ|INE121A01024",
  },
  {
    name: "ETERNAL LIMITED",
    asset_key: "NSE_EQ|INE758T01015",
  },
  {
    name: "ASHOK LEYLAND LTD",
    asset_key: "NSE_EQ|INE208A01029",
  },
  {
    name: "CESC LTD",
    asset_key: "NSE_EQ|INE486A01021",
  },
  {
    name: "ABB INDIA LIMITED",
    asset_key: "NSE_EQ|INE117A01022",
  },
  {
    name: "DIVI S LABORATORIES LTD",
    asset_key: "NSE_EQ|INE361B01024",
  },
  {
    name: "AARTI INDUSTRIES LTD",
    asset_key: "NSE_EQ|INE769A01020",
  },
  {
    name: "UNION BANK OF INDIA",
    asset_key: "NSE_EQ|INE692A01016",
  },
  {
    name: "COMPUTER AGE MNGT SER LTD",
    asset_key: "NSE_EQ|INE596I01012",
  },
  {
    name: "GMR AIRPORTS LIMITED",
    asset_key: "NSE_EQ|INE776C01039",
  },
  {
    name: "EICHER MOTORS LTD",
    asset_key: "NSE_EQ|INE066A01021",
  },
  {
    name: "HSG & URBAN DEV CORPN LTD",
    asset_key: "NSE_EQ|INE031A01017",
  },
  {
    name: "UNITED SPIRITS LIMITED",
    asset_key: "NSE_EQ|INE854D01024",
  },
  {
    name: "INOX WIND LIMITED",
    asset_key: "NSE_EQ|INE066P01011",
  },
  {
    name: "MPHASIS LIMITED",
    asset_key: "NSE_EQ|INE356A01018",
  },
  {
    name: "JIO FIN SERVICES LTD",
    asset_key: "NSE_EQ|INE758E01017",
  },
  {
    name: "PB FINTECH LIMITED",
    asset_key: "NSE_EQ|INE417T01026",
  },
  {
    name: "TATA CONSULTANCY SERV LT",
    asset_key: "NSE_EQ|INE467B01029",
  },
  {
    name: "UPL LIMITED",
    asset_key: "NSE_EQ|INE628A01036",
  },
  {
    name: "TATA TECHNOLOGIES LIMITED",
    asset_key: "NSE_EQ|INE142M01025",
  },
  {
    name: "EXIDE INDUSTRIES LTD",
    asset_key: "NSE_EQ|INE302A01020",
  },
  {
    name: "ALKEM LABORATORIES LTD.",
    asset_key: "NSE_EQ|INE540L01014",
  },
  {
    name: "ASIAN PAINTS LIMITED",
    asset_key: "NSE_EQ|INE021A01026",
  },
  {
    name: "JINDAL STAINLESS LIMITED",
    asset_key: "NSE_EQ|INE220G01021",
  },
  {
    name: "ADITYA BIRLA CAPITAL LTD.",
    asset_key: "NSE_EQ|INE674K01013",
  },
  {
    name: "DIXON TECHNO (INDIA) LTD",
    asset_key: "NSE_EQ|INE935N01020",
  },
  {
    name: "JSW ENERGY LIMITED",
    asset_key: "NSE_EQ|INE121E01018",
  },
  {
    name: "TECH MAHINDRA LIMITED",
    asset_key: "NSE_EQ|INE669C01036",
  },
  {
    name: "ICICI PRU LIFE INS CO LTD",
    asset_key: "NSE_EQ|INE726G01019",
  },
  {
    name: "ICICI LOMBARD GIC LIMITED",
    asset_key: "NSE_EQ|INE765G01017",
  },
  {
    name: "INDIAN OIL CORP LTD",
    asset_key: "NSE_EQ|INE242A01010",
  },
  {
    name: "POLYCAB INDIA LIMITED",
    asset_key: "NSE_EQ|INE455K01017",
  },
  {
    name: "FEDERAL BANK LTD",
    asset_key: "NSE_EQ|INE171A01029",
  },
  {
    name: "AMBUJA CEMENTS LTD",
    asset_key: "NSE_EQ|INE079A01024",
  },
  {
    name: "ASTRAL LIMITED",
    asset_key: "NSE_EQ|INE006I01046",
  },
  {
    name: "ANGEL ONE LIMITED",
    asset_key: "NSE_EQ|INE732I01013",
  },
  {
    name: "TUBE INVEST OF INDIA LTD",
    asset_key: "NSE_EQ|INE974X01010",
  },
  {
    name: "RBL BANK LIMITED",
    asset_key: "NSE_EQ|INE976G01028",
  },
  {
    name: "TITAGARH RAIL SYSTEMS LTD",
    asset_key: "NSE_EQ|INE615H01020",
  },
  {
    name: "POONAWALLA FINCORP LTD",
    asset_key: "NSE_EQ|INE511C01022",
  },
  {
    name: "DEEPAK NITRITE LTD",
    asset_key: "NSE_EQ|INE288B01029",
  },
  {
    name: "VODAFONE IDEA LIMITED",
    asset_key: "NSE_EQ|INE669E01016",
  },
  {
    name: "CONTAINER CORP OF IND LTD",
    asset_key: "NSE_EQ|INE111A01025",
  },
  {
    name: "IIFL FINANCE LIMITED",
    asset_key: "NSE_EQ|INE530B01024",
  },
  {
    name: "SHRIRAM FINANCE LIMITED",
    asset_key: "NSE_EQ|INE721A01047",
  },
  {
    name: "SUPREME INDUSTRIES LTD",
    asset_key: "NSE_EQ|INE195A01028",
  },
  {
    name: "INDIAN RAILWAY FIN CORP L",
    asset_key: "NSE_EQ|INE053F01010",
  },
  {
    name: "MAX HEALTHCARE INS LTD",
    asset_key: "NSE_EQ|INE027H01010",
  },
  {
    name: "SJVN LTD",
    asset_key: "NSE_EQ|INE002L01015",
  },
  {
    name: "CROMPT GREA CON ELEC LTD",
    asset_key: "NSE_EQ|INE299U01018",
  },
  {
    name: "KOTAK MAHINDRA BANK LTD",
    asset_key: "NSE_EQ|INE237A01028",
  },
  {
    name: "BHEL",
    asset_key: "NSE_EQ|INE257A01026",
  },
  {
    name: "SOLAR INDUSTRIES (I) LTD",
    asset_key: "NSE_EQ|INE343H01029",
  },
  {
    name: "BAJAJ AUTO LIMITED",
    asset_key: "NSE_EQ|INE917I01010",
  },
  {
    name: "NMDC LTD.",
    asset_key: "NSE_EQ|INE584A01023",
  },
  {
    name: "BHARTI AIRTEL LIMITED",
    asset_key: "NSE_EQ|INE397D01024",
  },
  {
    name: "CUMMINS INDIA LTD",
    asset_key: "NSE_EQ|INE298A01020",
  },
  {
    name: "REC LIMITED",
    asset_key: "NSE_EQ|INE020B01018",
  },
  {
    name: "NTPC LTD",
    asset_key: "NSE_EQ|INE733E01010",
  },
  {
    name: "SONA BLW PRECISION FRGS L",
    asset_key: "NSE_EQ|INE073K01018",
  },
  {
    name: "BHARAT FORGE LTD",
    asset_key: "NSE_EQ|INE465A01025",
  },
  {
    name: "BHARAT PETROLEUM CORP  LT",
    asset_key: "NSE_EQ|INE029A01011",
  },
  {
    name: "TITAN COMPANY LIMITED",
    asset_key: "NSE_EQ|INE280A01028",
  },
  {
    name: "NBCC (INDIA) LIMITED",
    asset_key: "NSE_EQ|INE095N01031",
  },
  {
    name: "BOSCH LIMITED",
    asset_key: "NSE_EQ|INE323A01026",
  },
  {
    name: "FSN E COMMERCE VENTURES",
    asset_key: "NSE_EQ|INE388Y01029",
  },
  {
    name: "MACROTECH DEVELOPERS LTD",
    asset_key: "NSE_EQ|INE670K01029",
  },
  {
    name: "BIOCON LIMITED.",
    asset_key: "NSE_EQ|INE376G01013",
  },
  {
    name: "BRITANNIA INDUSTRIES LTD",
    asset_key: "NSE_EQ|INE216A01030",
  },
  {
    name: "STEEL AUTHORITY OF INDIA",
    asset_key: "NSE_EQ|INE114A01011",
  },
  {
    name: "HDFC LIFE INS CO LTD",
    asset_key: "NSE_EQ|INE795G01014",
  },
  {
    name: "LARSEN & TOUBRO LTD.",
    asset_key: "NSE_EQ|INE018A01030",
  },
  {
    name: "THE RAMCO CEMENTS LIMITED",
    asset_key: "NSE_EQ|INE331A01037",
  },
  {
    name: "GLENMARK PHARMACEUTICALS",
    asset_key: "NSE_EQ|INE935A01035",
  },
  {
    name: "MAHANAGAR GAS LTD.",
    asset_key: "NSE_EQ|INE002S01010",
  },
  {
    name: "L&T FINANCE LIMITED",
    asset_key: "NSE_EQ|INE498L01015",
  },
  {
    name: "ADANI TOTAL GAS LIMITED",
    asset_key: "NSE_EQ|INE399L01023",
  },
  {
    name: "GAIL (INDIA) LTD",
    asset_key: "NSE_EQ|INE129A01019",
  },
  {
    name: "APL APOLLO TUBES LTD",
    asset_key: "NSE_EQ|INE702C01027",
  },
  {
    name: "PAGE INDUSTRIES LTD",
    asset_key: "NSE_EQ|INE761H01022",
  },
  {
    name: "SAMVRDHNA MTHRSN INTL LTD",
    asset_key: "NSE_EQ|INE775A01035",
  },
  {
    name: "APOLLO TYRES LTD",
    asset_key: "NSE_EQ|INE438A01022",
  },
  {
    name: "INDIAN ENERGY EXC LTD",
    asset_key: "NSE_EQ|INE022Q01020",
  },
  {
    name: "APOLLO HOSPITALS ENTER. L",
    asset_key: "NSE_EQ|INE437A01024",
  },
  {
    name: "TATA ELXSI LIMITED",
    asset_key: "NSE_EQ|INE670A01012",
  },
  {
    name: "PUNJAB NATIONAL BANK",
    asset_key: "NSE_EQ|INE160A01022",
  },
  {
    name: "TATA MOTORS LIMITED",
    asset_key: "NSE_EQ|INE155A01022",
  },
  {
    name: "PATANJALI FOODS LIMITED",
    asset_key: "NSE_EQ|INE619A01035",
  },
  {
    name: "ITC LTD",
    asset_key: "NSE_EQ|INE154A01025",
  },
  {
    name: "TATA POWER CO LTD",
    asset_key: "NSE_EQ|INE245A01021",
  },
  {
    name: "MULTI COMMODITY EXCHANGE",
    asset_key: "NSE_EQ|INE745G01035",
  },
  {
    name: "TORRENT PHARMACEUTICALS L",
    asset_key: "NSE_EQ|INE685A01028",
  },
  {
    name: "INDUS TOWERS LIMITED",
    asset_key: "NSE_EQ|INE121J01017",
  },
  {
    name: "HAVELLS INDIA LIMITED",
    asset_key: "NSE_EQ|INE176B01034",
  },
  {
    name: "TATA STEEL LIMITED",
    asset_key: "NSE_EQ|INE081A01020",
  },
  {
    name: "TORRENT POWER LTD",
    asset_key: "NSE_EQ|INE813H01021",
  },
  {
    name: "JINDAL STEEL & POWER LTD",
    asset_key: "NSE_EQ|INE749A01030",
  },
  {
    name: "INTERGLOBE AVIATION LTD",
    asset_key: "NSE_EQ|INE646L01027",
  },
  {
    name: "INFOSYS LIMITED",
    asset_key: "NSE_EQ|INE009A01021",
  },
  {
    name: "PNB HOUSING FIN LTD.",
    asset_key: "NSE_EQ|INE572E01012",
  },
  {
    name: "AVENUE SUPERMARTS LIMITED",
    asset_key: "NSE_EQ|INE192R01011",
  },
  {
    name: "DLF LIMITED",
    asset_key: "NSE_EQ|INE271C01023",
  },
  {
    name: "HCL TECHNOLOGIES LTD",
    asset_key: "NSE_EQ|INE860A01027",
  },
  {
    name: "MARICO LIMITED",
    asset_key: "NSE_EQ|INE196A01026",
  },
  {
    name: "ONE 97 COMMUNICATIONS LTD",
    asset_key: "NSE_EQ|INE982J01020",
  },
  {
    name: "BANKNIFTY",
    asset_key: "NSE_INDEX|Nifty Bank",
  },
  {
    name: "HDFC AMC LIMITED",
    asset_key: "NSE_EQ|INE127D01025",
  },
  {
    name: "TATA CONSUMER PRODUCT LTD",
    asset_key: "NSE_EQ|INE192A01025",
  },
  {
    name: "LAURUS LABS LIMITED",
    asset_key: "NSE_EQ|INE947Q01028",
  },
  {
    name: "MARUTI SUZUKI INDIA LTD.",
    asset_key: "NSE_EQ|INE585B01010",
  },
  {
    name: "PIRAMAL ENTERPRISES LTD",
    asset_key: "NSE_EQ|INE140A01024",
  },
  {
    name: "LIC HOUSING FINANCE LTD",
    asset_key: "NSE_EQ|INE115A01026",
  },
  {
    name: "PERSISTENT SYSTEMS LTD",
    asset_key: "NSE_EQ|INE262H01021",
  },
  {
    name: "LIFE INSURA CORP OF INDIA",
    asset_key: "NSE_EQ|INE0J1Y01017",
  },
  {
    name: "INDRAPRASTHA GAS LTD",
    asset_key: "NSE_EQ|INE203G01027",
  },
  {
    name: "INDIAN RENEWABLE ENERGY",
    asset_key: "NSE_EQ|INE202E01016",
  },
  {
    name: "NCC LIMITED",
    asset_key: "NSE_EQ|INE868B01028",
  },
  {
    name: "MIDCPNIFTY",
    asset_key: "NSE_INDEX|NIFTY MID SELECT",
  },
  {
    name: "NIFTYNXT50",
    asset_key: "NSE_INDEX|Nifty Next 50",
  },
  {
    name: "PRESTIGE ESTATE LTD",
    asset_key: "NSE_EQ|INE811K01011",
  },
  {
    name: "NESTLE INDIA LIMITED",
    asset_key: "NSE_EQ|INE239A01024",
  },
  {
    name: "KPIT TECHNOLOGIES LIMITED",
    asset_key: "NSE_EQ|INE04I401011",
  },
  {
    name: "YES BANK LIMITED",
    asset_key: "NSE_EQ|INE528G01035",
  },
  {
    name: "WIPRO LTD",
    asset_key: "NSE_EQ|INE075A01022",
  },
  {
    name: "ZYDUS LIFESCIENCES LTD",
    asset_key: "NSE_EQ|INE010B01027",
  },
  {
    name: "NATIONAL ALUMINIUM CO LTD",
    asset_key: "NSE_EQ|INE139A01034",
  },
  {
    name: "MUTHOOT FINANCE LIMITED",
    asset_key: "NSE_EQ|INE414G01012",
  },
  {
    name: "INFO EDGE (I) LTD",
    asset_key: "NSE_EQ|INE663F01032",
  },
  {
    name: "NHPC LTD",
    asset_key: "NSE_EQ|INE848E01016",
  },
  {
    name: "M&M FIN. SERVICES LTD",
    asset_key: "NSE_EQ|INE774D01024",
  },
  {
    name: "MANAPPURAM FINANCE LTD",
    asset_key: "NSE_EQ|INE522D01027",
  },
  {
    name: "MAHINDRA & MAHINDRA LTD",
    asset_key: "NSE_EQ|INE101A01026",
  },
  {
    name: "SYNGENE INTERNATIONAL LTD",
    asset_key: "NSE_EQ|INE398R01022",
  },
  {
    name: "TATA COMMUNICATIONS LTD",
    asset_key: "NSE_EQ|INE151A01013",
  },
  {
    name: "TATA CHEMICALS LTD",
    asset_key: "NSE_EQ|INE092A01019",
  },
  {
    name: "SIEMENS LTD",
    asset_key: "NSE_EQ|INE003A01024",
  },
  {
    name: "POWER GRID CORP. LTD.",
    asset_key: "NSE_EQ|INE752E01010",
  },
  {
    name: "PETRONET LNG LIMITED",
    asset_key: "NSE_EQ|INE347G01014",
  },
  {
    name: "THE PHOENIX MILLS LTD",
    asset_key: "NSE_EQ|INE211B01039",
  },
  {
    name: "POWER FIN CORP LTD.",
    asset_key: "NSE_EQ|INE134E01011",
  },
  {
    name: "PI INDUSTRIES LTD",
    asset_key: "NSE_EQ|INE603J01030",
  },
  {
    name: "COAL INDIA LTD",
    asset_key: "NSE_EQ|INE522F01014",
  },
  {
    name: "CHAMBAL FERTILIZERS LTD",
    asset_key: "NSE_EQ|INE085A01013",
  },
  {
    name: "CIPLA LTD",
    asset_key: "NSE_EQ|INE059A01026",
  },
  {
    name: "CG POWER AND IND SOL LTD",
    asset_key: "NSE_EQ|INE067A01029",
  },
  {
    name: "HINDUSTAN COPPER LTD",
    asset_key: "NSE_EQ|INE531E01026",
  },
  {
    name: "HINDALCO  INDUSTRIES  LTD",
    asset_key: "NSE_EQ|INE038A01020",
  },
  {
    name: "HINDUSTAN UNILEVER LTD.",
    asset_key: "NSE_EQ|INE030A01027",
  },
  {
    name: "HINDUSTAN PETROLEUM CORP",
    asset_key: "NSE_EQ|INE094A01015",
  },
  {
    name: "HDFC BANK LTD",
    asset_key: "NSE_EQ|INE040A01034",
  },
  {
    name: "HFCL LIMITED",
    asset_key: "NSE_EQ|INE548A01028",
  },
  {
    name: "HERO MOTOCORP LIMITED",
    asset_key: "NSE_EQ|INE158A01026",
  },
  {
    name: "IRB INFRA DEV LTD.",
    asset_key: "NSE_EQ|INE821I01022",
  },
  {
    name: "INDIAN RAIL TOUR CORP LTD",
    asset_key: "NSE_EQ|INE335Y01020",
  },
  {
    name: "INDIAN BANK",
    asset_key: "NSE_EQ|INE562A01011",
  },
  {
    name: "THE INDIAN HOTELS CO. LTD",
    asset_key: "NSE_EQ|INE053A01029",
  },
  {
    name: "DR. REDDY S LABORATORIES",
    asset_key: "NSE_EQ|INE089A01031",
  },
  {
    name: "181NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN022",
  },
  {
    name: "171NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN021",
  },
  {
    name: "ESCORTS KUBOTA LIMITED",
    asset_key: "NSE_EQ|INE042A01014",
  },
  {
    name: "011NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN005",
  },
  {
    name: "021NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN006",
  },
  {
    name: "031NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN007",
  },
  {
    name: "051NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN009",
  },
  {
    name: "041NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN008",
  },
  {
    name: "071NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN011",
  },
  {
    name: "061NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN010",
  },
  {
    name: "081NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN012",
  },
  {
    name: "131NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN017",
  },
  {
    name: "141NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN018",
  },
  {
    name: "121NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN016",
  },
  {
    name: "101NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN014",
  },
  {
    name: "111NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN015",
  },
  {
    name: "091NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN013",
  },
  {
    name: "151NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN019",
  },
  {
    name: "161NSETEST",
    asset_key: "NSE_EQ|DUMMYSAN020",
  },
  {
    name: "KAYNES TECHNOLOGY IND LTD",
    asset_key: "NSE_EQ|INE918Z01012",
  },
  {
    name: "RAIL VIKAS NIGAM LIMITED",
    asset_key: "NSE_EQ|INE415G01027",
  },
  {
    name: "FORTIS HEALTHCARE LTD",
    asset_key: "NSE_EQ|INE061F01013",
  },
  {
    name: "MANKIND PHARMA LIMITED",
    asset_key: "NSE_EQ|INE634S01028",
  },
  {
    name: "BHARAT DYNAMICS LIMITED",
    asset_key: "NSE_EQ|INE171Z01026",
  },
  {
    name: "BLUE STAR LIMITED",
    asset_key: "NSE_EQ|INE472A01039",
  },
  {
    name: "MAZAGON DOCK SHIPBUIL LTD",
    asset_key: "NSE_EQ|INE249Z01020",
  },
  {
    name: "CUMMINS INDIA LTD",
    asset_key: "NSE_EQ|INE298A01020",
  },
  {
    name: "SONA BLW PRECISION FRGS L",
    asset_key: "NSE_EQ|INE073K01018",
  },
  {
    name: "PIRAMAL PHARMA LIMITED",
    asset_key: "NSE_EQ|INE0DK501011",
  },
  {
    name: "UNO MINDA LIMITED",
    asset_key: "NSE_EQ|INE405E01023",
  },
];

module.exports = nseFoNames;
