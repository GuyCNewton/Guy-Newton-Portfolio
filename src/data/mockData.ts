import { parseISO } from 'date-fns';

export interface Order {
  customer_id: string;
  acquisition_channel: string;
  signup_source: string;
  region: string;
  customer_tier: string;
  plan_price: number;
  arpu: number;
  gross_margin: number;
  churn_rate: number;
  marketing_spend: number;
  date: Date;
  // Mapped fields for dashboard compatibility
  id: string;
  price: number;
  product: string;
  paymentMethod: string;
}

export const RAW_DATA = `year,month,date,customer_id,acquisition_channel,signup_source,region,customer_tier,plan_price,discount_rate,arpu,gross_margin,churn_rate,contract_length_months,marketing_spend
2023,1,Jan-23,1001,outbound_sales,web,North America,Basic,78.84,0.1,63.63,0.76,0.022,12,212.48
2023,1,Jan-23,1002,meta_ads,web,LatAm,Pro,120.23,0,124.47,0.84,0.0512,1,352.6
2023,1,Jan-23,1003,organic_search,mobile_app,North America,Enterprise,335.82,0.2,278.2,0.81,0.0193,12,55.4
2023,1,Jan-23,1004,organic_search,web,Europe,Pro,193.89,0.1,190.65,0.8,0.0842,1,49.1
2023,1,Jan-23,1005,organic_search,web,APAC,Enterprise,471.8,0.1,445.32,0.8,0.0773,1,45.27
2023,1,Jan-23,1006,organic_search,mobile_app,APAC,Pro,138.52,0.1,133.17,0.8,0.076,1,56.92
2023,1,Jan-23,1007,google_ads,web,North America,Basic,78.34,0,73.19,0.83,0.0901,1,348.95
2023,1,Jan-23,1008,organic_search,web,APAC,Enterprise,443.64,0,471.77,0.87,0.0285,12,52.27
2023,1,Jan-23,1009,outbound_sales,partner,APAC,Pro,108.54,0.2,81.91,0.8,0.0228,12,223.23
2023,1,Jan-23,1010,google_ads,partner,North America,Pro,183.89,0,187.27,0.87,0.0761,1,391.3
2023,1,Jan-23,1011,meta_ads,web,North America,Enterprise,341.61,0,342.49,0.89,0.0705,1,376.83
2023,1,Jan-23,1012,outbound_sales,web,North America,Enterprise,407.44,0.1,380.38,0.79,0.0728,1,183.11
2023,1,Jan-23,1013,outbound_sales,mobile_app,APAC,Pro,111.21,0,105.14,0.77,0.0714,1,219.08
2023,1,Jan-23,1014,google_ads,partner,North America,Enterprise,324.22,0,342.94,0.79,0.0584,1,366.25
2023,1,Jan-23,1015,outbound_sales,web,Europe,Pro,196.18,0.1,186.96,0.86,0.0999,1,186.01
2023,1,Jan-23,1016,meta_ads,mobile_app,Europe,Enterprise,282.59,0,293.98,0.85,0.0724,1,355.55
2023,1,Jan-23,1017,organic_search,partner,APAC,Enterprise,271.65,0.1,234.79,0.84,0.0207,12,43.85
2023,1,Jan-23,1018,google_ads,web,Europe,Pro,168.58,0.2,138.54,0.85,0.0756,1,367.18
2023,1,Jan-23,1019,outbound_sales,partner,North America,Basic,68.88,0.2,62.32,0.77,0.0557,1,225.48
2023,1,Jan-23,1020,meta_ads,mobile_app,North America,Pro,197.22,0,181.95,0.76,0.028,12,363.98
2023,1,Jan-23,1021,google_ads,web,Europe,Enterprise,455.9,0.1,444.76,0.85,0.0581,1,447.83
2023,1,Jan-23,1022,outbound_sales,mobile_app,North America,Pro,193.01,0,164.35,0.77,0.0846,1,209.12
2023,1,Jan-23,1023,google_ads,web,North America,Pro,131.54,0.2,112.21,0.8,0.0754,1,416.36
2023,1,Jan-23,1024,meta_ads,mobile_app,Middle East,Pro,138.31,0.1,139.64,0.82,0.0823,1,367.74
2023,1,Jan-23,1025,google_ads,web,North America,Enterprise,370.6,0,319.86,0.9,0.064,1,446.02
2023,1,Jan-23,1026,outbound_sales,web,LatAm,Basic,70.41,0,71.94,0.9,0.0653,1,181.45
2023,1,Jan-23,1027,google_ads,partner,North America,Basic,68.73,0.1,65.49,0.84,0.0808,1,458.81
2023,1,Jan-23,1028,meta_ads,partner,Europe,Pro,131.26,0,116.95,0.86,0.0648,1,341.58
2023,1,Jan-23,1029,meta_ads,web,Middle East,Pro,99.52,0,90.39,0.76,0.0525,1,390.59
2023,1,Jan-23,1030,organic_search,mobile_app,North America,Enterprise,400.61,0.2,317.18,0.83,0.0795,1,42.96
2023,1,Jan-23,1031,outbound_sales,mobile_app,APAC,Pro,152.71,0,153.73,0.87,0.0811,1,175.12
2023,1,Jan-23,1032,google_ads,mobile_app,Europe,Enterprise,240.51,0,274.39,0.86,0.0699,1,392.02
2023,1,Jan-23,1033,meta_ads,partner,North America,Pro,195.26,0.2,152.85,0.85,0.0958,1,343.95
2023,1,Jan-23,1034,outbound_sales,mobile_app,North America,Basic,82.01,0,85.41,0.83,0.0187,12,213.8
2023,1,Jan-23,1035,organic_search,mobile_app,Europe,Basic,55.01,0,48.67,0.76,0.0928,1,53.05
2023,1,Jan-23,1036,outbound_sales,mobile_app,APAC,Basic,72.67,0,71.9,0.85,0.0975,1,223.2
2023,1,Jan-23,1037,outbound_sales,partner,North America,Enterprise,349.94,0,354.07,0.85,0.0289,12,226.66
2023,1,Jan-23,1038,outbound_sales,partner,APAC,Pro,156.34,0,154.38,0.83,0.0177,12,227.67
2023,1,Jan-23,1039,meta_ads,partner,North America,Basic,59.73,0.1,45.99,0.76,0.0114,12,330.99
2023,1,Jan-23,1040,meta_ads,mobile_app,North America,Pro,125.07,0.2,88.59,0.85,0.0275,12,374.68
2023,1,Jan-23,1041,google_ads,web,North America,Pro,141.35,0.2,129.72,0.81,0.0888,1,380.9
2023,1,Jan-23,1042,meta_ads,web,North America,Enterprise,424.26,0,390.94,0.81,0.0748,1,338.41
2023,1,Jan-23,1043,google_ads,partner,North America,Basic,94.27,0,89.16,0.89,0.0215,12,415.82
2023,1,Jan-23,1044,google_ads,web,North America,Basic,76.69,0,82.5,0.87,0.0118,12,399.33
2023,1,Jan-23,1045,organic_search,mobile_app,Europe,Basic,85.85,0,82.01,0.77,0.0881,1,51.77
2023,1,Jan-23,1046,google_ads,mobile_app,North America,Basic,60.13,0,65.94,0.86,0.0542,1,458.4
2023,1,Jan-23,1047,outbound_sales,web,Europe,Basic,96.36,0,99.02,0.8,0.0196,12,192.68
2023,1,Jan-23,1048,organic_search,partner,North America,Enterprise,232.36,0.2,172.15,0.81,0.087,1,54.01
2023,1,Jan-23,1049,organic_search,web,APAC,Enterprise,374.01,0.1,326.53,0.82,0.0764,1,49.05
2023,1,Jan-23,1050,meta_ads,web,LatAm,Basic,65.13,0.1,66.08,0.89,0.0848,1,305.42
2023,1,Jan-23,1051,organic_search,web,North America,Enterprise,335.36,0,355.17,0.81,0.0283,12,56.88
2023,1,Jan-23,1052,outbound_sales,mobile_app,Europe,Basic,62.87,0.1,54.69,0.78,0.068,1,185.6
2023,1,Jan-23,1053,organic_search,mobile_app,North America,Basic,64.48,0,68.05,0.77,0.0265,12,56.75
2023,1,Jan-23,1054,outbound_sales,web,Middle East,Pro,107.27,0.1,107.15,0.76,0.0688,1,218.63
2023,1,Jan-23,1055,outbound_sales,partner,North America,Basic,86.48,0,98.67,0.88,0.0194,12,194.89
2023,1,Jan-23,1056,google_ads,web,North America,Pro,168.17,0,193.38,0.9,0.0884,1,453.37
2023,1,Jan-23,1057,meta_ads,partner,North America,Pro,119.5,0,135.78,0.84,0.0836,1,362.4
2023,1,Jan-23,1058,outbound_sales,partner,North America,Pro,148.82,0.1,144.88,0.83,0.021,12,203.66
2023,1,Jan-23,1059,meta_ads,partner,Europe,Enterprise,207.63,0.2,180.29,0.85,0.0281,12,362.31
2023,1,Jan-23,1060,meta_ads,mobile_app,Middle East,Pro,138.22,0.2,97.01,0.86,0.0725,1,393.1
2023,1,Jan-23,1061,meta_ads,partner,Europe,Basic,96.48,0.1,97.94,0.82,0.073,1,400.4
2023,1,Jan-23,1062,google_ads,mobile_app,Europe,Enterprise,372.89,0.2,260.35,0.77,0.0576,1,356.66
2023,1,Jan-23,1063,outbound_sales,web,APAC,Enterprise,353.57,0.1,327.94,0.78,0.0169,12,190.86
2023,1,Jan-23,1064,meta_ads,web,Europe,Basic,72.04,0.1,72.5,0.77,0.0661,1,307.19
2023,1,Jan-23,1065,organic_search,web,Africa,Pro,114.7,0,97.58,0.88,0.0799,1,57.29
2023,1,Jan-23,1066,organic_search,partner,LatAm,Pro,160.83,0.2,129.87,0.86,0.0574,1,44.5
2023,1,Jan-23,1067,organic_search,partner,APAC,Enterprise,358.63,0,398.14,0.8,0.0552,1,53.56
2023,1,Jan-23,1068,outbound_sales,mobile_app,Middle East,Basic,59.57,0.1,54.18,0.78,0.0737,1,191.31
2023,1,Jan-23,1069,google_ads,web,Europe,Enterprise,420.05,0.2,360.78,0.81,0.0642,1,383.57
2023,1,Jan-23,1070,meta_ads,mobile_app,North America,Enterprise,494.95,0,559.35,0.75,0.0683,1,348.72
2023,1,Jan-23,1071,meta_ads,partner,North America,Pro,116.34,0.2,102.63,0.76,0.0848,1,402.21
2023,1,Jan-23,1072,meta_ads,mobile_app,Middle East,Enterprise,458.65,0.1,471.62,0.82,0.0264,12,372.94
2023,1,Jan-23,1073,organic_search,mobile_app,North America,Basic,58.35,0.1,55.84,0.78,0.0206,12,53.11
2023,1,Jan-23,1074,meta_ads,mobile_app,Middle East,Enterprise,478.6,0,483.28,0.76,0.0567,1,304.15
2023,1,Jan-23,1075,outbound_sales,mobile_app,Europe,Pro,107.79,0.2,90.93,0.86,0.0736,1,194.71
2023,1,Jan-23,1076,meta_ads,partner,LatAm,Pro,173.6,0.1,138.63,0.86,0.0136,12,304.48
2023,1,Jan-23,1077,outbound_sales,mobile_app,North America,Basic,55.99,0,60.2,0.87,0.0137,12,184.14
2023,1,Jan-23,1078,meta_ads,mobile_app,LatAm,Basic,92.86,0,97.96,0.82,0.028,12,363.03
2023,1,Jan-23,1079,google_ads,partner,Europe,Basic,60.61,0,58.64,0.83,0.0615,1,405.14
2023,1,Jan-23,1080,meta_ads,mobile_app,Europe,Enterprise,299.47,0.2,266.79,0.82,0.0215,12,402.26
2023,1,Jan-23,1081,google_ads,web,APAC,Enterprise,422.18,0.1,346.28,0.86,0.0877,1,352.35
2023,1,Jan-23,1082,google_ads,partner,Europe,Basic,55.37,0.2,48.25,0.77,0.0861,1,426.4
2023,1,Jan-23,1083,organic_search,partner,Africa,Pro,124.18,0,136.35,0.89,0.0614,1,48.85
2023,1,Jan-23,1084,meta_ads,mobile_app,Middle East,Pro,157.62,0.1,124.87,0.79,0.0219,12,308.23
2023,1,Jan-23,1085,outbound_sales,web,LatAm,Enterprise,244.76,0.2,202.08,0.81,0.0287,12,225.53
2023,1,Jan-23,1086,organic_search,web,North America,Basic,57.28,0.1,56.77,0.8,0.0614,1,51.62
2023,1,Jan-23,1087,organic_search,web,APAC,Pro,179.29,0,184.87,0.77,0.0932,1,56.34
2023,1,Jan-23,1088,organic_search,mobile_app,Europe,Enterprise,334.67,0.2,230.21,0.89,0.0789,1,44.98
2023,1,Jan-23,1089,google_ads,web,Europe,Enterprise,282.28,0.1,216.94,0.85,0.0981,1,357.84
2023,1,Jan-23,1090,meta_ads,mobile_app,North America,Basic,58.22,0.2,47.91,0.76,0.0142,12,391.8
2023,1,Jan-23,1091,outbound_sales,mobile_app,North America,Basic,67.89,0.2,47.24,0.87,0.0762,1,196.45
2023,1,Jan-23,1092,meta_ads,mobile_app,Middle East,Enterprise,229.89,0,200.61,0.86,0.0949,1,352.79
2023,1,Jan-23,1093,google_ads,partner,LatAm,Pro,185.7,0,188.58,0.79,0.0753,1,411.41
2023,1,Jan-23,1094,google_ads,partner,Middle East,Enterprise,394.82,0.2,336.78,0.87,0.0221,12,436.82
2023,1,Jan-23,1095,outbound_sales,web,North America,Pro,128.31,0.1,98.61,0.76,0.0513,1,180.89
2023,1,Jan-23,1096,outbound_sales,web,Europe,Pro,190.06,0,181.04,0.79,0.0795,1,186.08
2023,1,Jan-23,1097,google_ads,web,Europe,Pro,135.28,0,126.94,0.89,0.0128,12,444.22
2023,1,Jan-23,1098,outbound_sales,partner,APAC,Basic,73.24,0,68.16,0.83,0.0152,12,178.36
2023,1,Jan-23,1099,organic_search,mobile_app,LatAm,Pro,189.06,0.1,158.53,0.75,0.0124,12,51.15
2023,1,Jan-23,1100,meta_ads,mobile_app,Middle East,Basic,73.87,0.2,52.12,0.77,0.0633,1,374.38
2024,12,Dec-24,8048,outbound_sales,partner,North America,Pro,135.03,0.2,121.16,0.85,0.0172,12,196.03
2024,12,Dec-24,8049,meta_ads,web,Europe,Enterprise,212.15,0,205.67,0.77,0.0967,1,387.65
2024,12,Dec-24,8050,google_ads,mobile_app,APAC,Basic,93.17,0.2,73.99,0.86,0.0147,12,440.16
2024,12,Dec-24,8051,outbound_sales,partner,APAC,Pro,174.87,0.1,147.56,0.88,0.0111,12,213.46
2024,12,Dec-24,8052,meta_ads,web,APAC,Enterprise,483.05,0.2,357.64,0.86,0.0798,1,357.55
2024,12,Dec-24,8053,google_ads,mobile_app,Europe,Enterprise,412.39,0.2,290.8,0.82,0.0512,1,405.68
2024,12,Dec-24,8054,meta_ads,mobile_app,Europe,Basic,70.16,0.2,62.56,0.87,0.0225,12,391.52
2024,12,Dec-24,8055,google_ads,partner,North America,Basic,90.34,0.2,68.05,0.83,0.084,1,395.73
2024,12,Dec-24,8056,meta_ads,web,APAC,Enterprise,324.44,0,307.26,0.8,0.0749,1,346.55
2024,12,Dec-24,8057,google_ads,web,North America,Pro,198.2,0.1,161.55,0.86,0.0875,1,388.48`;


export const parseCSV = (csv: string): Order[] => {
  const lines = csv.trim().split('\n');
  return lines.slice(1)
    .filter(line => line.trim() !== '')
    .map(line => {
      const parts = line.split(',');
      if (parts.length < 15) return null;

      const [
        year, month, dateStr, customer_id, acquisition_channel, 
        signup_source, region, customer_tier, plan_price, 
        discount_rate, arpu, gross_margin, churn_rate, 
        contract_length_months, marketing_spend
      ] = parts;
      
      const arpuVal = parseFloat(arpu) || 0;
      
      // Attempt to parse dateStr like "Jan-23" into a Date object
      let date: Date;
      if (dateStr && dateStr.includes('-')) {
        const [m, y] = dateStr.split('-');
        const monthMap: Record<string, string> = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
          'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        const monthNum = monthMap[m] || '01';
        date = parseISO(`20${y}-${monthNum}-01`);
      } else {
        date = dateStr ? parseISO(dateStr) : new Date();
      }

      // Final safety check for date
      if (isNaN(date.getTime())) {
        date = new Date();
      }
      
      return {
        customer_id: customer_id || 'unknown',
        acquisition_channel: acquisition_channel || 'unknown',
        signup_source: signup_source || 'unknown',
        region: region || 'unknown',
        customer_tier: customer_tier || 'Basic',
        plan_price: parseFloat(plan_price) || 0,
        arpu: arpuVal,
        gross_margin: parseFloat(gross_margin) || 0,
        churn_rate: parseFloat(churn_rate) || 0,
        marketing_spend: parseFloat(marketing_spend) || 0,
        date,
        // Mapped fields for dashboard compatibility
        id: customer_id || 'unknown',
        price: arpuVal, // Mapping arpu to revenue field
        product: customer_tier || 'Basic',
        paymentMethod: acquisition_channel || 'unknown'
      };
    })
    .filter((order): order is Order => order !== null);
};
