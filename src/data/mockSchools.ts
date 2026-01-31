export type SchoolType = 'middle' | 'high' | 'both';

export interface School {
  id: string;
  name: string;
  region: string;
  type: SchoolType;
}

export const MOCK_SCHOOLS: School[] = [
  { id: '1', name: '開成中学校', region: '東京都', type: 'middle' },
  { id: '2', name: '灘中学校', region: '兵庫県', type: 'middle' },
  { id: '3', name: '開成高等学校', region: '東京都', type: 'high' },
  { id: '4', name: '灘高等学校', region: '兵庫県', type: 'high' },
  { id: '5', name: '麻布中学校・高等学校', region: '東京都', type: 'both' },
  { id: '6', name: '桜蔭中学校・高等学校', region: '東京都', type: 'both' },
  { id: '7', name: '筑波大学附属駒場中学校・高等学校', region: '東京都', type: 'both' },
  { id: '8', name: '渋谷教育学園幕張中学校・高等学校', region: '千葉県', type: 'both' },
  { id: '9', name: '駒場東邦中学校・高等学校', region: '東京都', type: 'both' },
  { id: '10', name: '雙葉中学校・高等学校', region: '東京都', type: 'both' },
  { id: '11', name: '女子学院中学校・高等学校', region: '東京都', type: 'both' },
  { id: '12', name: 'ラ・サール中学校・高等学校', region: '鹿児島県', type: 'both' },
  { id: '13', name: '早稲田大学高等学院・中学部', region: '東京都', type: 'both' },
  { id: '14', name: '慶應義塾中等部・高等学校', region: '東京都', type: 'both' },
  { id: '15', name: '豊島岡女子学園中学校・高等学校', region: '東京都', type: 'both' },
  { id: '16', name: '聖光学院中学校・高等学校', region: '神奈川県', type: 'both' },
  { id: '17', name: '栄光学園中学校・高等学校', region: '神奈川県', type: 'both' },
];
