import { Pangu } from '../../dist/shared/index.js';
import { describe, it, expect } from 'vitest';

const pangu = new Pangu();

describe('Pangu', () => {
  describe('spacingText()', () => {
    it('should handle short text', () => {
      expect(pangu.spacingText('中a')).toBe('中 a');
      expect(pangu.spacingText('a中')).toBe('a 中');
      expect(pangu.spacingText('1中')).toBe('1 中');
      expect(pangu.spacingText('中1')).toBe('中 1');
      expect(pangu.spacingText('中a1')).toBe('中 a1');
      expect(pangu.spacingText('a1中')).toBe('a1 中');
      expect(pangu.spacingText('a中1')).toBe('a 中 1');
      expect(pangu.spacingText('1中a')).toBe('1 中 a');
    });

    // 兩邊都加空格

    it('should handle alphabets', () => {
      expect(pangu.spacingText('中文abc')).toBe('中文 abc');
      expect(pangu.spacingText('abc中文')).toBe('abc 中文');
    });

    it('should handle numbers', () => {
      expect(pangu.spacingText('中文123')).toBe('中文 123');
      expect(pangu.spacingText('123中文')).toBe('123 中文');
    });

    // https://symbl.cc/en/unicode-table/#latin-1-supplement
    it('should handle Latin-1 Supplement', () => {
      expect(pangu.spacingText('中文Ø漢字')).toBe('中文 Ø 漢字');
      expect(pangu.spacingText('中文 Ø 漢字')).toBe('中文 Ø 漢字');
    });

    // https://symbl.cc/en/unicode-table/#greek-coptic
    it('should handle Greek and Coptic', () => {
      expect(pangu.spacingText('中文β漢字')).toBe('中文 β 漢字');
      expect(pangu.spacingText('中文 β 漢字')).toBe('中文 β 漢字');
      expect(pangu.spacingText('我是α，我是Ω')).toBe('我是 α，我是 Ω');
    });

    // https://symbl.cc/en/unicode-table/#number-forms
    it('should handle Number Forms', () => {
      expect(pangu.spacingText('中文Ⅶ漢字')).toBe('中文 Ⅶ 漢字');
      expect(pangu.spacingText('中文 Ⅶ 漢字')).toBe('中文 Ⅶ 漢字');
    });

    // https://symbl.cc/en/unicode-table/#cjk-radicals-supplement
    it('should handle CJK Radicals Supplement', () => {
      expect(pangu.spacingText('abc⻤123')).toBe('abc ⻤ 123');
      expect(pangu.spacingText('abc ⻤ 123')).toBe('abc ⻤ 123');
    });

    // https://symbl.cc/en/unicode-table/#kangxi-radicals
    it('should handle Kangxi Radicals', () => {
      expect(pangu.spacingText('abc⾗123')).toBe('abc ⾗ 123');
      expect(pangu.spacingText('abc ⾗ 123')).toBe('abc ⾗ 123');
    });

    // https://symbl.cc/en/unicode-table/#hiragana
    it('should handle Hiragana', () => {
      expect(pangu.spacingText('abcあ123')).toBe('abc あ 123');
      expect(pangu.spacingText('abc あ 123')).toBe('abc あ 123');
    });

    // https://symbl.cc/en/unicode-table/#katakana
    it('should handle Katakana', () => {
      expect(pangu.spacingText('abcア123')).toBe('abc ア 123');
      expect(pangu.spacingText('abc ア 123')).toBe('abc ア 123');
    });

    // https://symbl.cc/en/unicode-table/#bopomofo
    it('should handle Bopomofo', () => {
      expect(pangu.spacingText('abcㄅ123')).toBe('abc ㄅ 123');
      expect(pangu.spacingText('abc ㄅ 123')).toBe('abc ㄅ 123');
    });

    // https://symbl.cc/en/unicode-table/#enclosed-cjk-letters-and-months
    it('should handle Enclosed CJK Letters And Months', () => {
      expect(pangu.spacingText('abc㈱123')).toBe('abc ㈱ 123');
      expect(pangu.spacingText('abc ㈱ 123')).toBe('abc ㈱ 123');
    });

    // https://symbl.cc/en/unicode-table/#cjk-unified-ideographs-extension-a
    it('should handle CJK Unified Ideographs Extension-A', () => {
      expect(pangu.spacingText('abc㐂123')).toBe('abc 㐂 123');
      expect(pangu.spacingText('abc 㐂 123')).toBe('abc 㐂 123');
    });

    // https://symbl.cc/en/unicode-table/#cjk-unified-ideographs
    it('should handle CJK Unified Ideographs', () => {
      expect(pangu.spacingText('abc丁123')).toBe('abc 丁 123');
      expect(pangu.spacingText('abc 丁 123')).toBe('abc 丁 123');
    });

    // https://symbl.cc/en/unicode-table/#cjk-compatibility-ideographs
    it('should handle CJK Compatibility Ideographs', () => {
      expect(pangu.spacingText('abc車123')).toBe('abc 車 123');
      expect(pangu.spacingText('abc 車 123')).toBe('abc 車 123');
    });

    // 只加左空格

    it('should handle @ symbol', () => {
      expect(pangu.spacingText('請@vinta吃大便')).toBe('請 @vinta 吃大便');
      expect(pangu.spacingText('請@陳上進 吃大便')).toBe('請 @陳上進 吃大便');
    });

    it('should handle # symbol as hashtag', () => {
      expect(pangu.spacingText('前面#後面')).toBe('前面 #後面');
      expect(pangu.spacingText('前面#H2G2後面')).toBe('前面 #H2G2 後面');
      expect(pangu.spacingText('前面 #銀河便車指南 後面')).toBe('前面 #銀河便車指南 後面');
      expect(pangu.spacingText('前面#銀河便車指南 後面')).toBe('前面 #銀河便車指南 後面');
      expect(pangu.spacingText('前面#銀河公車指南 #銀河拖吊車指南 後面')).toBe('前面 #銀河公車指南 #銀河拖吊車指南 後面');

      // Special cases
      expect(pangu.spacingText('前面C#後面')).toBe('前面 C# 後面');
      expect(pangu.spacingText('前面F#後面')).toBe('前面 F# 後面');
    });

    // 只加右空格

    it('should handle ... symbol', () => {
      expect(pangu.spacingText('前面...後面')).toBe('前面... 後面');
      expect(pangu.spacingText('前面..後面')).toBe('前面.. 後面');
    });

    // \u2026
    it('should handle … symbol', () => {
      expect(pangu.spacingText('前面…後面')).toBe('前面… 後面');
      expect(pangu.spacingText('前面……後面')).toBe('前面…… 後面');
    });

    // 標點符號（換成全形符號）

    it('should handle ~ symbol', () => {
      expect(pangu.spacingText('前面~後面')).toBe('前面～後面');
      expect(pangu.spacingText('前面 ~ 後面')).toBe('前面～後面');
      expect(pangu.spacingText('前面~ 後面')).toBe('前面～後面');
      expect(pangu.spacingText('前面 ~後面')).toBe('前面～後面');
    });

    it('should handle ! symbol', () => {
      expect(pangu.spacingText('前面!後面')).toBe('前面！後面');
      expect(pangu.spacingText('前面 ! 後面')).toBe('前面！後面');
      expect(pangu.spacingText('前面! 後面')).toBe('前面！後面');
      expect(pangu.spacingText('前面 !後面')).toBe('前面！後面');
    });

    it('should handle ; symbol', () => {
      expect(pangu.spacingText('前面;後面')).toBe('前面；後面');
      expect(pangu.spacingText('前面 ; 後面')).toBe('前面；後面');
      expect(pangu.spacingText('前面; 後面')).toBe('前面；後面');
      expect(pangu.spacingText('前面 ;後面')).toBe('前面；後面');
    });

    it('should handle , symbol', () => {
      expect(pangu.spacingText('前面,後面')).toBe('前面，後面');
      expect(pangu.spacingText('前面 , 後面')).toBe('前面，後面');
      expect(pangu.spacingText('前面, 後面')).toBe('前面，後面');
      expect(pangu.spacingText('前面 ,後面')).toBe('前面，後面');
      expect(pangu.spacingText('前面,')).toBe('前面，');
      expect(pangu.spacingText('前面, ')).toBe('前面，');
    });

    it('should handle . symbol', () => {
      expect(pangu.spacingText('前面.後面')).toBe('前面。後面');
      expect(pangu.spacingText('前面 . 後面')).toBe('前面。後面');
      expect(pangu.spacingText('前面. 後面')).toBe('前面。後面');
      expect(pangu.spacingText('前面 .後面')).toBe('前面。後面');
      expect(pangu.spacingText('黑人問號.jpg 後面')).toBe('黑人問號.jpg 後面');
    });

    it('should handle ? symbol', () => {
      expect(pangu.spacingText('前面?後面')).toBe('前面？後面');
      expect(pangu.spacingText('前面 ? 後面')).toBe('前面？後面');
      expect(pangu.spacingText('前面? 後面')).toBe('前面？後面');
      expect(pangu.spacingText('前面 ?後面')).toBe('前面？後面');
      expect(pangu.spacingText('所以，請問Jackey的鼻子有幾個?3.14個')).toBe('所以，請問 Jackey 的鼻子有幾個？3.14 個');
    });

    // When the symbol appears only 1 time in one line
    it('should handle : symbol as colon', () => {
      expect(pangu.spacingText('前面:後面')).toBe('前面：後面');
      expect(pangu.spacingText('前面 : 後面')).toBe('前面：後面');
      expect(pangu.spacingText('前面: 後面')).toBe('前面：後面');
      expect(pangu.spacingText('前面 :後面')).toBe('前面：後面');
      expect(pangu.spacingText('電話:123456789')).toBe('電話：123456789');
      expect(pangu.spacingText('前面:)後面')).toBe('前面：) 後面');
      expect(pangu.spacingText('前面:I have no idea後面')).toBe('前面：I have no idea 後面');
      expect(pangu.spacingText('前面: I have no idea後面')).toBe('前面: I have no idea 後面');
    });

    // When the symbol appears 2+ times or more in one line
    it('should handle : symbol as separator', () => {
      // TODO
    });

    // \u00b7
    it('should handle · symbol', () => {
      expect(pangu.spacingText('前面·後面')).toBe('前面・後面');
      expect(pangu.spacingText('喬治·R·R·馬丁')).toBe('喬治・R・R・馬丁');
      expect(pangu.spacingText('M·奈特·沙马兰')).toBe('M・奈特・沙马兰');
    });

    // \u2022
    it('should handle • symbol', () => {
      expect(pangu.spacingText('前面•後面')).toBe('前面・後面');
      expect(pangu.spacingText('喬治•R•R•馬丁')).toBe('喬治・R・R・馬丁');
      expect(pangu.spacingText('M•奈特•沙马兰')).toBe('M・奈特・沙马兰');
    });

    // \u2027
    it('should handle ‧ symbol', () => {
      expect(pangu.spacingText('前面‧後面')).toBe('前面・後面');
      expect(pangu.spacingText('喬治‧R‧R‧馬丁')).toBe('喬治・R・R・馬丁');
      expect(pangu.spacingText('M‧奈特‧沙马兰')).toBe('M・奈特・沙马兰');
    });

    // 單位符號

    it('should handle $ symbol', () => {
      expect(pangu.spacingText('前面$後面')).toBe('前面 $ 後面');
      expect(pangu.spacingText('前面 $ 後面')).toBe('前面 $ 後面');
      expect(pangu.spacingText('前面$100後面')).toBe('前面 $100 後面');
    });

    it('should handle % symbol', () => {
      expect(pangu.spacingText('前面%後面')).toBe('前面 % 後面');
      expect(pangu.spacingText('前面 % 後面')).toBe('前面 % 後面');
      expect(pangu.spacingText('前面100%後面')).toBe('前面 100% 後面');

      // prettier-ignore
      expect(pangu.spacingText('新八的構造成分有95%是眼鏡、3%是水、2%是垃圾'))
                         .toBe('新八的構造成分有 95% 是眼鏡、3% 是水、2% 是垃圾');

      // prettier-ignore
      expect(pangu.spacingText("丹寧控注意Levi's全館任2件25%OFF滿額再享85折！"))
                         .toBe("丹寧控注意 Levi's 全館任 2 件 25% OFF 滿額再享 85 折！");
    });

    // 計算符號

    // When the symbol appears only 1 time or shows up with other operators in one line
    it('should handle = symbol as operator, ALWAYS spacing', () => {
      expect(pangu.spacingText('前面=後面')).toBe('前面 = 後面');
      expect(pangu.spacingText('Vinta=Mollie')).toBe('Vinta=Mollie'); // If no CJK, DO NOT change
      expect(pangu.spacingText('Vinta=陳上進')).toBe('Vinta = 陳上進');
      expect(pangu.spacingText('陳上進=Vinta')).toBe('陳上進 = Vinta');
      expect(pangu.spacingText('得到一個A=B的結果')).toBe('得到一個 A = B 的結果');

      // DO NOT change if already spacing
      expect(pangu.spacingText('前面 = 後面')).toBe('前面 = 後面');
      expect(pangu.spacingText('Vinta = Mollie')).toBe('Vinta = Mollie');
      expect(pangu.spacingText('Vinta = 陳上進')).toBe('Vinta = 陳上進');
      expect(pangu.spacingText('陳上進 = Vinta')).toBe('陳上進 = Vinta');
      expect(pangu.spacingText('得到一個 A = B 的結果')).toBe('得到一個 A = B 的結果');
    });

    // When the symbol appears only 1 time or shows up with other operators in one line
    it('should handle + symbol as operator, ALWAYS spacing', () => {
      expect(pangu.spacingText('前面+後面')).toBe('前面 + 後面');
      expect(pangu.spacingText('Vinta+Mollie')).toBe('Vinta+Mollie'); // If no CJK, DO NOT change
      expect(pangu.spacingText('Vinta+陳上進')).toBe('Vinta + 陳上進');
      expect(pangu.spacingText('陳上進+Vinta')).toBe('陳上進 + Vinta');
      expect(pangu.spacingText('得到一個A+B的結果')).toBe('得到一個 A + B 的結果');

      // DO NOT change if already spacing
      expect(pangu.spacingText('前面 + 後面')).toBe('前面 + 後面');
      expect(pangu.spacingText('Vinta + Mollie')).toBe('Vinta + Mollie');
      expect(pangu.spacingText('Vinta + 陳上進')).toBe('Vinta + 陳上進');
      expect(pangu.spacingText('陳上進 + Vinta')).toBe('陳上進 + Vinta');
      expect(pangu.spacingText('得到一個 A + B 的結果')).toBe('得到一個 A + B 的結果');

      // Special cases
      expect(pangu.spacingText('得到一個A+的結果')).toBe('得到一個 A+ 的結果');
      expect(pangu.spacingText('得到一個 A+ 的結果')).toBe('得到一個 A+ 的結果');
      expect(pangu.spacingText('得到一個C++的結果')).toBe('得到一個 C++ 的結果');
      expect(pangu.spacingText('得到一個 C++的結果')).toBe('得到一個 C++ 的結果');
      expect(pangu.spacingText('得到一個i++的結果')).toBe('得到一個 i++ 的結果');
    });

    // When the symbol appears only 1 time or shows up with other operators in one line
    it('should handle - symbol as operator, ALWAYS spacing', () => {
      expect(pangu.spacingText('前面-後面')).toBe('前面 - 後面');
      expect(pangu.spacingText('Vinta-Mollie')).toBe('Vinta-Mollie'); // If no CJK, DO NOT change
      expect(pangu.spacingText('Vinta-陳上進')).toBe('Vinta - 陳上進');
      expect(pangu.spacingText('陳上進-Vinta')).toBe('陳上進 - Vinta');
      expect(pangu.spacingText('得到一個A-B的結果')).toBe('得到一個 A - B 的結果');

      // DO NOT change if already spacing
      expect(pangu.spacingText('前面 - 後面')).toBe('前面 - 後面');
      expect(pangu.spacingText('Vinta - Mollie')).toBe('Vinta - Mollie');
      expect(pangu.spacingText('Vinta - 陳上進')).toBe('Vinta - 陳上進');
      expect(pangu.spacingText('陳上進 - Vinta')).toBe('陳上進 - Vinta');
      expect(pangu.spacingText('得到一個 A - B 的結果')).toBe('得到一個 A - B 的結果');

      // Compound words
      expect(pangu.spacingText('Sci-Fi')).toBe('Sci-Fi');

      // prettier-ignore
      expect(pangu.spacingText('The company offered a state-of-the-art machine-learning-powered real-time fraud-detection system with end-to-end encryption and cutting-edge performance.'))
                         .toBe('The company offered a state-of-the-art machine-learning-powered real-time fraud-detection system with end-to-end encryption and cutting-edge performance.');

      // prettier-ignore
      expect(pangu.spacingText('這間公司提供了一套state-of-the-art、machine-learning-powered的real-time fraud-detection系統，具備end-to-end加密功能以及cutting-edge的效能。'))
                         .toBe('這間公司提供了一套 state-of-the-art、machine-learning-powered 的 real-time fraud-detection 系統，具備 end-to-end 加密功能以及 cutting-edge 的效能。');

      expect(pangu.spacingText('Anthropic的claude-4-opus模型')).toBe('Anthropic 的 claude-4-opus 模型');
      expect(pangu.spacingText('OpenAI的o3-pro模型')).toBe('OpenAI 的 o3-pro 模型');
      expect(pangu.spacingText('OpenAI的gpt-4o模型')).toBe('OpenAI 的 gpt-4o 模型');
      expect(pangu.spacingText('OpenAI的GPT-5模型')).toBe('OpenAI 的 GPT-5 模型');
      expect(pangu.spacingText('Google的gemini-2.5-pro模型')).toBe('Google 的 gemini-2.5-pro 模型');

      expect(pangu.spacingText('得到一個D-的結果')).toBe('得到一個 D- 的結果');
      expect(pangu.spacingText('得到一個D--的結果')).toBe('得到一個 D-- 的結果');

      // prettier-ignore
      expect(pangu.spacingText('长者的智慧和复杂的维斯特洛- 文章')).toBe('长者的智慧和复杂的维斯特洛 - 文章');

      // TODO: TDB
      // expect(pangu.spacingText('陳上進--Vinta')).toBe('陳上進 -- Vinta');
      // expect(pangu.spacingText('陳上進---Vinta')).toBe('陳上進 --- Vinta');
    });

    // When the symbol appears only 1 time or shows up with other operators in one line
    it('should handle * symbol as operator, ALWAYS spacing', () => {
      expect(pangu.spacingText('前面*後面')).toBe('前面 * 後面');
      expect(pangu.spacingText('Vinta*Mollie')).toBe('Vinta*Mollie'); // If no CJK, DO NOT change
      expect(pangu.spacingText('Vinta*陳上進')).toBe('Vinta * 陳上進');
      expect(pangu.spacingText('陳上進*Vinta')).toBe('陳上進 * Vinta');
      expect(pangu.spacingText('得到一個A*B的結果')).toBe('得到一個 A * B 的結果');

      // DO NOT change if already spacing
      expect(pangu.spacingText('前面 * 後面')).toBe('前面 * 後面');
      expect(pangu.spacingText('Vinta * Mollie')).toBe('Vinta * Mollie');
      expect(pangu.spacingText('Vinta * 陳上進')).toBe('Vinta * 陳上進');
      expect(pangu.spacingText('陳上進 * Vinta')).toBe('陳上進 * Vinta');
      expect(pangu.spacingText('得到一個 A * B 的結果')).toBe('得到一個 A * B 的結果');
    });

    // When the symbol appears only 1 time or shows up with other operators in one line
    it('should handle < symbol as operator, ALWAYS spacing', () => {
      expect(pangu.spacingText('前面<後面')).toBe('前面 < 後面');
      expect(pangu.spacingText('Vinta<Mollie')).toBe('Vinta<Mollie'); // If no CJK, DO NOT change
      expect(pangu.spacingText('Vinta<陳上進')).toBe('Vinta < 陳上進');
      expect(pangu.spacingText('陳上進<Vinta')).toBe('陳上進 < Vinta');
      expect(pangu.spacingText('得到一個A<B的結果')).toBe('得到一個 A < B 的結果');

      // DO NOT change if already spacing
      expect(pangu.spacingText('前面 < 後面')).toBe('前面 < 後面');
      expect(pangu.spacingText('Vinta < Mollie')).toBe('Vinta < Mollie');
      expect(pangu.spacingText('Vinta < 陳上進')).toBe('Vinta < 陳上進');
      expect(pangu.spacingText('陳上進 < Vinta')).toBe('陳上進 < Vinta');
      expect(pangu.spacingText('得到一個 A < B 的結果')).toBe('得到一個 A < B 的結果');
    });

    // When the symbol appears only 1 time or shows up with other operators in one line
    it('should handle > symbol as operator, ALWAYS spacing', () => {
      expect(pangu.spacingText('前面>後面')).toBe('前面 > 後面');
      expect(pangu.spacingText('Vinta>Mollie')).toBe('Vinta>Mollie'); // If no CJK, DO NOT change
      expect(pangu.spacingText('Vinta>陳上進')).toBe('Vinta > 陳上進');
      expect(pangu.spacingText('陳上進>Vinta')).toBe('陳上進 > Vinta');
      expect(pangu.spacingText('得到一個A>B的結果')).toBe('得到一個 A > B 的結果');

      // DO NOT change if already spacing
      expect(pangu.spacingText('前面 > 後面')).toBe('前面 > 後面');
      expect(pangu.spacingText('Vinta > Mollie')).toBe('Vinta > Mollie');
      expect(pangu.spacingText('Vinta > 陳上進')).toBe('Vinta > 陳上進');
      expect(pangu.spacingText('陳上進 > Vinta')).toBe('陳上進 > Vinta');
      expect(pangu.spacingText('得到一個 A > B 的結果')).toBe('得到一個 A > B 的結果');
    });

    // When the symbol appears only 1 time or shows up with other operators in one line
    it('should handle & symbol as operator, ALWAYS spacing', () => {
      expect(pangu.spacingText('前面&後面')).toBe('前面 & 後面');
      expect(pangu.spacingText('Vinta&Mollie')).toBe('Vinta&Mollie'); // If no CJK, DO NOT change
      expect(pangu.spacingText('Vinta&陳上進')).toBe('Vinta & 陳上進');
      expect(pangu.spacingText('陳上進&Vinta')).toBe('陳上進 & Vinta');
      expect(pangu.spacingText('得到一個A&B的結果')).toBe('得到一個 A & B 的結果');

      // DO NOT change if already spacing
      expect(pangu.spacingText('前面 & 後面')).toBe('前面 & 後面');
      expect(pangu.spacingText('Vinta & Mollie')).toBe('Vinta & Mollie');
      expect(pangu.spacingText('Vinta & 陳上進')).toBe('Vinta & 陳上進');
      expect(pangu.spacingText('陳上進 & Vinta')).toBe('陳上進 & Vinta');
      expect(pangu.spacingText('得到一個 A & B 的結果')).toBe('得到一個 A & B 的結果');
    });

    // When the symbol appears only 1 time or shows up with other operators in one line
    it('should handle ^ symbol as operator, ALWAYS spacing', () => {
      expect(pangu.spacingText('前面^後面')).toBe('前面 ^ 後面');
      expect(pangu.spacingText('前面 ^ 後面')).toBe('前面 ^ 後面');
    });

    // 分隔符號

    it('should handle _ symbol as separator, DO NOT spacing', () => {
      expect(pangu.spacingText('前面_後面')).toBe('前面_後面');
      expect(pangu.spacingText('Vinta_Mollie')).toBe('Vinta_Mollie');
      expect(pangu.spacingText('Vinta_Mollie_Kitten')).toBe('Vinta_Mollie_Kitten');
      expect(pangu.spacingText('Mollie_陳上進')).toBe('Mollie_陳上進');
      expect(pangu.spacingText('陳上進_Mollie')).toBe('陳上進_Mollie');
      expect(pangu.spacingText('陳上進_貓咪_Mollie')).toBe('陳上進_貓咪_Mollie');
      expect(pangu.spacingText('陳上進_Mollie_貓咪')).toBe('陳上進_Mollie_貓咪');
      expect(pangu.spacingText('Mollie_Vinta_貓咪')).toBe('Mollie_Vinta_貓咪');
      expect(pangu.spacingText('Mollie_陳上進_貓咪')).toBe('Mollie_陳上進_貓咪');

      // prettier-ignore
      expect(pangu.spacingText('為什麼你們就是不能加個空格呢？_20771210_最終版_v365.7.24.zip'))
                         .toBe('為什麼你們就是不能加個空格呢？_20771210_最終版_v365.7.24.zip');

      // DO NOT change if already spacing, rare cases, ignore
      // expect(pangu.spacingText('前面 _ 後面')).toBe('前面 _ 後面');
      // expect(pangu.spacingText('Vinta _ Mollie')).toBe('Vinta _ Mollie');
      // expect(pangu.spacingText('Vinta _ Mollie _ Kitten')).toBe('Vinta _ Mollie _ Kitten');
      // expect(pangu.spacingText('陳上進 _ 貓咪 _ Mollie')).toBe('陳上進 _ 貓咪 _ Mollie');
      // expect(pangu.spacingText('陳上進 _ Mollie _ 貓咪')).toBe('陳上進 _ Mollie _ 貓咪');
      // expect(pangu.spacingText('Mollie _ Vinta _ 貓咪')).toBe('Mollie _ Vinta _ 貓咪');
      // expect(pangu.spacingText('Mollie _ 陳上進 _ 貓咪')).toBe('Mollie _ 陳上進 _ 貓咪');

      // TODO: TBD
      // expect(pangu.spacingText('得到一個A_B的結果')).toBe('得到一個A_B的結果');
    });

    it('should handle | symbol as separator, DO NOT spacing', () => {
      expect(pangu.spacingText('前面|後面')).toBe('前面|後面');
      expect(pangu.spacingText('Vinta|Mollie')).toBe('Vinta|Mollie');
      expect(pangu.spacingText('Vinta|Mollie|Kitten')).toBe('Vinta|Mollie|Kitten');
      expect(pangu.spacingText('Mollie|陳上進')).toBe('Mollie|陳上進');
      expect(pangu.spacingText('陳上進|Mollie')).toBe('陳上進|Mollie');
      expect(pangu.spacingText('陳上進|貓咪|Mollie')).toBe('陳上進|貓咪|Mollie');
      expect(pangu.spacingText('陳上進|Mollie|貓咪')).toBe('陳上進|Mollie|貓咪');
      expect(pangu.spacingText('Mollie|Vinta|貓咪')).toBe('Mollie|Vinta|貓咪');
      expect(pangu.spacingText('Mollie|陳上進|貓咪')).toBe('Mollie|陳上進|貓咪');

      // DO NOT change if already spacing, rare cases, ignore
      // expect(pangu.spacingText('前面 | 後面')).toBe('前面 | 後面');
      // expect(pangu.spacingText('Vinta | Mollie')).toBe('Vinta | Mollie');
      // expect(pangu.spacingText('Vinta | Mollie | Kitten')).toBe('Vinta | Mollie | Kitten');
      // expect(pangu.spacingText('陳上進 | 貓咪 | Mollie')).toBe('陳上進 | 貓咪 | Mollie');
      // expect(pangu.spacingText('陳上進 | Mollie | 貓咪')).toBe('陳上進 | Mollie | 貓咪');
      // expect(pangu.spacingText('Mollie | Vinta | 貓咪')).toBe('Mollie | Vinta | 貓咪');
      // expect(pangu.spacingText('Mollie | 陳上進 | 貓咪')).toBe('Mollie | 陳上進 | 貓咪');

      // TODO: TBD
      // expect(pangu.spacingText('得到一個A|B的結果')).toBe('得到一個A|B的結果');
    });

    // When the symbol appears only 1 time or shows up with other operators in one line
    it('should handle / symbol as operator, ALWAYS spacing', () => {
      expect(pangu.spacingText('前面/後面')).toBe('前面 / 後面');
      expect(pangu.spacingText('Vinta/Mollie')).toBe('Vinta/Mollie'); // If no CJK, DO NOT change
      expect(pangu.spacingText('Mollie/陳上進')).toBe('Mollie / 陳上進');
      expect(pangu.spacingText('陳上進/Mollie')).toBe('陳上進 / Mollie');
      expect(pangu.spacingText('得到一個A/B的結果')).toBe('得到一個 A / B 的結果');

      expect(pangu.spacingText('吃apple / banana')).toBe('吃 apple / banana');

      // DO NOT change if already spacing
      expect(pangu.spacingText('前面 / 後面')).toBe('前面 / 後面');
      expect(pangu.spacingText('Vinta / Mollie')).toBe('Vinta / Mollie');
      expect(pangu.spacingText('Mollie / 陳上進')).toBe('Mollie / 陳上進');
      expect(pangu.spacingText('陳上進 / Mollie')).toBe('陳上進 / Mollie');
      expect(pangu.spacingText('得到一個 A / B 的結果')).toBe('得到一個 A / B 的結果');
      expect(pangu.spacingText('好人 / bad guy')).toBe('好人 / bad guy');
    });

    // When the symbol appears 2+ times or more in one line
    it('should handle / symbol as separator, DO NOT spacing', () => {
      expect(pangu.spacingText('陳上進/貓咪/Mollie')).toBe('陳上進/貓咪/Mollie');
      expect(pangu.spacingText('陳上進/Mollie/貓咪')).toBe('陳上進/Mollie/貓咪');
      expect(pangu.spacingText('Mollie/Vinta/貓咪')).toBe('Mollie/Vinta/貓咪');
      expect(pangu.spacingText('Mollie/陳上進/貓咪')).toBe('Mollie/陳上進/貓咪');

      // prettier-ignore
      expect(pangu.spacingText("8964/3★集會所接待員/克隆·麻煩大師/手卷師傅（已退休）/主程式毀滅者/dae-dae-o/#絕地家庭小會議/#今天大掃除了沒有/NS編號在banner裡/discord:史單力#3230"))
                         .toBe("8964/3★集會所接待員/克隆・麻煩大師/手卷師傅（已退休）/主程式毀滅者/dae-dae-o/#絕地家庭小會議/#今天大掃除了沒有/NS 編號在 banner 裡/discord: 史單力 #3230");

      // prettier-ignore
      expect(pangu.spacingText("after 80'/气象工作者/不苟同/关注abc天气变化/向往123自由/热爱科学、互联网、编程Node.js Web C++ Julia Python"))
                         .toBe("after 80'/气象工作者/不苟同/关注 abc 天气变化/向往 123 自由/热爱科学、互联网、编程 Node.js Web C++ Julia Python");

      // prettier-ignore
      expect(pangu.spacingText('2016-12-26(奇幻电影节) / 2017-01-20(美国) / 詹姆斯麦卡沃伊'))
                         .toBe('2016-12-26 (奇幻电影节) / 2017-01-20 (美国) / 詹姆斯麦卡沃伊');

      // DO NOT change if already spacing
      expect(pangu.spacingText('陳上進 / 貓咪 / Mollie')).toBe('陳上進 / 貓咪 / Mollie');
      expect(pangu.spacingText('陳上進 / Mollie / 貓咪')).toBe('陳上進 / Mollie / 貓咪');
      expect(pangu.spacingText('Mollie / Vinta / 貓咪')).toBe('Mollie / Vinta / 貓咪');
      expect(pangu.spacingText('Mollie / 陳上進 / 貓咪')).toBe('Mollie / 陳上進 / 貓咪');
    });

    it('should handle / symbol as Unix absolute file path', () => {
      // prettier-ignore
      expect(pangu.spacingText('/home和/root是Linux中的頂級目錄'))
                         .toBe('/home 和 /root 是 Linux 中的頂級目錄');

      // prettier-ignore
      expect(pangu.spacingText('/home/與/root是Linux中的頂級目錄'))
                         .toBe('/home/ 與 /root 是 Linux 中的頂級目錄');

      // prettier-ignore
      expect(pangu.spacingText('"/home/"和"/root"是Linux中的頂級目錄'))
                         .toBe('"/home/" 和 "/root" 是 Linux 中的頂級目錄');

      // prettier-ignore
      expect(pangu.spacingText('當你用cat和od指令查看/dev/random和/dev/urandom的內容時'))
                         .toBe('當你用 cat 和 od 指令查看 /dev/random 和 /dev/urandom 的內容時');

      // prettier-ignore
      expect(pangu.spacingText('當你用cat和od指令查看"/dev/random"和"/dev/urandom"的內容時'))
                         .toBe('當你用 cat 和 od 指令查看 "/dev/random" 和 "/dev/urandom" 的內容時');

      // Basic Unix paths
      expect(pangu.spacingText('在/home目錄')).toBe('在 /home 目錄');
      expect(pangu.spacingText('查看/etc/passwd文件')).toBe('查看 /etc/passwd 文件');
      expect(pangu.spacingText('進入/usr/local/bin目錄')).toBe('進入 /usr/local/bin 目錄');

      // Paths with dots
      expect(pangu.spacingText('配置檔在/etc/nginx/nginx.conf')).toBe('配置檔在 /etc/nginx/nginx.conf');
      expect(pangu.spacingText('隱藏檔案/.bashrc很重要')).toBe('隱藏檔案 /.bashrc 很重要');
      expect(pangu.spacingText('查看/home/.config/settings')).toBe('查看 /home/.config/settings');

      // Paths with version numbers
      expect(pangu.spacingText('安裝到/usr/lib/python3.9/')).toBe('安裝到 /usr/lib/python3.9/');
      expect(pangu.spacingText('位於/opt/node-v16.14.0/bin')).toBe('位於 /opt/node-v16.14.0/bin');

      // Paths with special characters
      expect(pangu.spacingText('備份到/mnt/backup.2024-01-01/')).toBe('備份到 /mnt/backup.2024-01-01/');
      expect(pangu.spacingText('日誌在/var/log/app-name.log')).toBe('日誌在 /var/log/app-name.log');

      // Paths with @ symbols (npm packages)
      expect(pangu.spacingText('模組在/node_modules/@babel/core')).toBe('模組在 /node_modules/@babel/core');
      expect(pangu.spacingText('套件在/node_modules/@types/node')).toBe('套件在 /node_modules/@types/node');

      // Paths with + symbols
      expect(pangu.spacingText('編譯器在/usr/bin/g++')).toBe('編譯器在 /usr/bin/g++');

      // prettier-ignore
      expect(pangu.spacingText('套件在/usr/lib/gcc/x86_64-linux-gnu/11++'))
                         .toBe('套件在 /usr/lib/gcc/x86_64-linux-gnu/11++');

      // Paths ending with slash before CJK
      expect(pangu.spacingText('目錄/usr/bin/包含執行檔')).toBe('目錄 /usr/bin/ 包含執行檔');
      expect(pangu.spacingText('資料夾/etc/nginx/存放設定')).toBe('資料夾 /etc/nginx/ 存放設定');
    });

    it('should handle / symbol as Unix relative file path', () => {
      // Basic relative paths
      expect(pangu.spacingText('檢查src/main.py文件')).toBe('檢查 src/main.py 文件');
      expect(pangu.spacingText('構建dist/index.js完成')).toBe('構建 dist/index.js 完成');
      expect(pangu.spacingText('運行test/spec.js測試')).toBe('運行 test/spec.js 測試');
      expect(pangu.spacingText('編輯docs/README.md文檔')).toBe('編輯 docs/README.md 文檔');

      // Project directories
      expect(pangu.spacingText('查看templates/base.html模板')).toBe('查看 templates/base.html 模板');
      expect(pangu.spacingText('複製assets/images/logo.png圖片')).toBe('複製 assets/images/logo.png 圖片');
      expect(pangu.spacingText('配置config/database.yml設定')).toBe('配置 config/database.yml 設定');
      expect(pangu.spacingText('執行scripts/deploy.sh腳本')).toBe('執行 scripts/deploy.sh 腳本');

      // Build/output directories
      expect(pangu.spacingText('清理build/temp/目錄')).toBe('清理 build/temp/ 目錄');
      expect(pangu.spacingText('輸出到target/release/資料夾')).toBe('輸出到 target/release/ 資料夾');
      expect(pangu.spacingText('發布到public/static/路徑')).toBe('發布到 public/static/ 路徑');

      // Development directories
      expect(pangu.spacingText('安裝node_modules/@babel/core套件')).toBe('安裝 node_modules/@babel/core 套件');
      expect(pangu.spacingText('設定.git/hooks/pre-commit鉤子')).toBe('設定 .git/hooks/pre-commit 鉤子');
      expect(pangu.spacingText('編輯.vscode/settings.json配置')).toBe('編輯 .vscode/settings.json 配置');

      // With leading ./
      expect(pangu.spacingText('參考./docs/API.md文件')).toBe('參考 ./docs/API.md 文件');
      expect(pangu.spacingText('執行./scripts/test.sh腳本')).toBe('執行 ./scripts/test.sh 腳本');
      expect(pangu.spacingText('查看./.claude/CLAUDE.md說明')).toBe('查看 ./.claude/CLAUDE.md 說明');

      // Wildcard patterns
      expect(pangu.spacingText('模板在templates/*.html裡')).toBe('模板在 templates/*.html 裡');
      expect(pangu.spacingText('測試所有test/**/*.js檔案')).toBe('測試所有 test/**/*.js 檔案');

      // Nested paths
      expect(pangu.spacingText('位於src/components/Button/index.tsx')).toBe('位於 src/components/Button/index.tsx');
      expect(pangu.spacingText('存放在assets/fonts/Inter/Regular.woff2')).toBe('存放在 assets/fonts/Inter/Regular.woff2');

      // Multiple file paths in one sentence
      expect(pangu.spacingText('從src/utils.js複製到dist/utils.js')).toBe('從 src/utils.js 複製到 dist/utils.js');
      expect(pangu.spacingText('比較test/fixtures/input.txt和test/fixtures/output.txt')).toBe('比較 test/fixtures/input.txt 和 test/fixtures/output.txt');
    });

    it('should handle \\ symbol', () => {
      expect(pangu.spacingText('前面\\後面')).toBe('前面 \\ 後面');
      expect(pangu.spacingText('前面 \\ 後面')).toBe('前面 \\ 後面');
    });

    it('should handle \\ symbol as escape character', () => {
      expect(pangu.spacingText('\\n')).toBe('\\n');
      expect(pangu.spacingText('\\t')).toBe('\\t');
    });

    it('should handle \\ symbol as Windows file path', () => {
      expect(pangu.spacingText('檔案在C:\\Users\\name\\')).toBe('檔案在 C:\\Users\\name\\');
      expect(pangu.spacingText('程式在D:\\Program Files\\')).toBe('程式在 D:\\Program Files\\');
      expect(pangu.spacingText('在C:\\Windows\\System32')).toBe('在 C:\\Windows\\System32');
    });

    it('should handle . symbol as file path', () => {
      // File extensions should keep spacing
      expect(pangu.spacingText('使用Python.py檔案')).toBe('使用 Python.py 檔案');
      expect(pangu.spacingText('設定檔.env很重要')).toBe('設定檔.env 很重要');
      expect(pangu.spacingText('編輯器.vscode目錄')).toBe('編輯器.vscode 目錄');

      // Multiple dots
      expect(pangu.spacingText('版本v1.2.3發布了')).toBe('版本 v1.2.3 發布了');
      expect(pangu.spacingText('檔案package.lock.json存在')).toBe('檔案 package.lock.json 存在');

      // CJK before dot patterns
      expect(pangu.spacingText('環境.env')).toBe('環境.env');
      expect(pangu.spacingText('測試.test.js')).toBe('測試.test.js');
      expect(pangu.spacingText('專案.gitignore')).toBe('專案.gitignore');

      // Mixed patterns
      expect(pangu.spacingText('使用環境.env配置')).toBe('使用環境.env 配置');
      expect(pangu.spacingText('專案.prettierrc和.eslintrc')).toBe('專案.prettierrc 和.eslintrc');
    });

    // 成對符號：相異

    it('should handle < > symbols', () => {
      expect(pangu.spacingText('前面<中文123漢字>後面')).toBe('前面 <中文 123 漢字> 後面');
      expect(pangu.spacingText('前面<中文123>後面')).toBe('前面 <中文 123> 後面');
      expect(pangu.spacingText('前面<123漢字>後面')).toBe('前面 <123 漢字> 後面');
      expect(pangu.spacingText('前面<中文123> tail')).toBe('前面 <中文 123> tail');
      expect(pangu.spacingText('head <中文123漢字>後面')).toBe('head <中文 123 漢字> 後面');
      expect(pangu.spacingText('head <中文123漢字> tail')).toBe('head <中文 123 漢字> tail');
    });

    it('should handle < > as HTML tags', () => {
      expect(pangu.spacingText('<p>一行文本</p>')).toBe('<p>一行文本</p>');
      expect(pangu.spacingText('<p>文字<strong>加粗</strong></p>')).toBe('<p>文字<strong>加粗</strong></p>');
      expect(pangu.spacingText('<div>測試<span>內容</span>結束</div>')).toBe('<div>測試<span>內容</span>結束</div>');
      expect(pangu.spacingText('<a href="#">連結</a>')).toBe('<a href="#">連結</a>');
      expect(pangu.spacingText('<input value="測試123">')).toBe('<input value="測試 123">');
      expect(pangu.spacingText('<img src="test.jpg" alt="測試圖片">')).toBe('<img src="test.jpg" alt="測試圖片">');

      // Multiple tags
      expect(pangu.spacingText('<p>第一段</p><p>第二段</p>')).toBe('<p>第一段</p><p>第二段</p>');
      expect(pangu.spacingText('<h1>標題</h1><p>內容</p>')).toBe('<h1>標題</h1><p>內容</p>');

      // Nested tags
      expect(pangu.spacingText('<div><p>嵌套<strong>測試</strong></p></div>')).toBe('<div><p>嵌套<strong>測試</strong></p></div>');

      // Self-closing tags
      expect(pangu.spacingText('文字<br>換行')).toBe('文字<br>換行');
      expect(pangu.spacingText('水平線<hr>分隔')).toBe('水平線<hr>分隔');
      expect(pangu.spacingText('水平線<hr />分隔')).toBe('水平線<hr />分隔');

      // prettier-ignore
      // FIXME
      // expect(pangu.spacingText('<attackOnJava>那一天，人類終於回想起了，曾經一度被XML所支配的恐懼</attackOnJava> <!--進擊的Java-->'))
      //                    .toBe('<attackOnJava>那一天，人類終於回想起了，曾經一度被 XML 所支配的恐懼</attackOnJava> <!--進擊的 Java-->');
    });

    it('should handle ( ) symbols', () => {
      expect(pangu.spacingText('前面(中文123漢字)後面')).toBe('前面 (中文 123 漢字) 後面');
      expect(pangu.spacingText('前面(中文123)後面')).toBe('前面 (中文 123) 後面');
      expect(pangu.spacingText('前面(123漢字)後面')).toBe('前面 (123 漢字) 後面');
      expect(pangu.spacingText('前面(中文123) tail')).toBe('前面 (中文 123) tail');
      expect(pangu.spacingText('head (中文123漢字)後面')).toBe('head (中文 123 漢字) 後面');
      expect(pangu.spacingText('head (中文123漢字) tail')).toBe('head (中文 123 漢字) tail');
      expect(pangu.spacingText('(or simply "React")')).toBe('(or simply "React")');
      expect(pangu.spacingText('function(123)')).toBe('function(123)');
      expect(pangu.spacingText('我看过的电影(1404)')).toBe('我看过的电影 (1404)');

      // prettier-ignore
      expect(pangu.spacingText('預定於繳款截止日114/07/02(遇假日順延)之次一營業日進行扣款'))
                         .toBe('預定於繳款截止日 114/07/02 (遇假日順延) 之次一營業日進行扣款');

      // prettier-ignore
      expect(pangu.spacingText("OperationalError: (2006, 'MySQL server has gone away')"))
                         .toBe("OperationalError: (2006, 'MySQL server has gone away')");

      // prettier-ignore
      expect(pangu.spacingText('Chang Stream(变更记录流)是指collection(数据库集合)的变更事件流'))
                         .toBe('Chang Stream (变更记录流) 是指 collection (数据库集合) 的变更事件流');

      // prettier-ignore
      expect(pangu.spacingText('从结果来看，当a.b销毁后，`a.getB()`返回值为null'))
                         .toBe('从结果来看，当 a.b 销毁后，`a.getB()` 返回值为 null');

      // prettier-ignore
      expect(pangu.spacingText("后续会直接用iframe window.addEventListener('message')"))
                         .toBe("后续会直接用 iframe window.addEventListener('message')");
    });

    it('should handle { } symbols', () => {
      expect(pangu.spacingText('前面{中文123漢字}後面')).toBe('前面 {中文 123 漢字} 後面');
      expect(pangu.spacingText('前面{中文123}後面')).toBe('前面 {中文 123} 後面');
      expect(pangu.spacingText('前面{123漢字}後面')).toBe('前面 {123 漢字} 後面');
      expect(pangu.spacingText('前面{中文123} tail')).toBe('前面 {中文 123} tail');
      expect(pangu.spacingText('head {中文123漢字}後面')).toBe('head {中文 123 漢字} 後面');
      expect(pangu.spacingText('head {中文123漢字} tail')).toBe('head {中文 123 漢字} tail');
    });

    it('should handle [ ] symbols', () => {
      expect(pangu.spacingText('前面[中文123漢字]後面')).toBe('前面 [中文 123 漢字] 後面');
      expect(pangu.spacingText('前面[中文123]後面')).toBe('前面 [中文 123] 後面');
      expect(pangu.spacingText('前面[123漢字]後面')).toBe('前面 [123 漢字] 後面');
      expect(pangu.spacingText('前面[中文123] tail')).toBe('前面 [中文 123] tail');
      expect(pangu.spacingText('head [中文123漢字]後面')).toBe('head [中文 123 漢字] 後面');
      expect(pangu.spacingText('head [中文123漢字] tail')).toBe('head [中文 123 漢字] tail');
    });

    // \u201c
    // \u201d
    it('should handle English with “ ” symbols', () => {
      expect(pangu.spacing('阿里云开源“计算王牌”Blink，实时计算时代已来')).toBe('阿里云开源 “计算王牌” Blink，实时计算时代已来');
      expect(pangu.spacing('苹果撤销Facebook“企业证书”后者股价一度短线走低')).toBe('苹果撤销 Facebook “企业证书” 后者股价一度短线走低');
      expect(pangu.spacingText('【UCG中字】“數毛社”DF的《戰神4》全新演示解析')).toBe('【UCG 中字】“數毛社” DF 的《戰神 4》全新演示解析');
    });

    // 成對符號：相同

    it('should handle ` ` symbols', () => {
      expect(pangu.spacingText('前面`中間`後面')).toBe('前面 `中間` 後面');
    });

    it('should handle # # symbols as Weibo-like hashtags', () => {
      expect(pangu.spacingText('前面#H2G2#後面')).toBe('前面 #H2G2# 後面');
      expect(pangu.spacingText('前面#銀河閃電霹靂車指南#後面')).toBe('前面 #銀河閃電霹靂車指南# 後面');
    });

    it('should handle " " symbols', () => {
      expect(pangu.spacingText('前面"中文123漢字"後面')).toBe('前面 "中文 123 漢字" 後面');
      expect(pangu.spacingText('前面"中文123"後面')).toBe('前面 "中文 123" 後面');
      expect(pangu.spacingText('前面"中文abc"後面')).toBe('前面 "中文 abc" 後面');
      expect(pangu.spacingText('前面"123漢字"後面')).toBe('前面 "123 漢字" 後面');
      expect(pangu.spacingText('前面"中文123" tail')).toBe('前面 "中文 123" tail');
      expect(pangu.spacingText('head "中文123漢字"後面')).toBe('head "中文 123 漢字" 後面');
      expect(pangu.spacingText('head "中文123漢字" tail')).toBe('head "中文 123 漢字" tail');
    });

    it("should handle ' ' symbols", () => {
      expect(pangu.spacingText("陳上進 likes 林依諾's status.")).toBe("陳上進 likes 林依諾's status.");

      // prettier-ignore
      expect(pangu.spacingText("Why are Python's 'private' methods not actually private?"))
                         .toBe("Why are Python's 'private' methods not actually private?");

      // prettier-ignore
      expect(pangu.spacingText("举个栗子，如果一道题只包含'A' ~ 'Z'意味着字符集大小是"))
                         .toBe("举个栗子，如果一道题只包含 'A' ~ 'Z' 意味着字符集大小是");
    });

    // \u05f4
    it('should handle ״ ״ symbols', () => {
      expect(pangu.spacingText('前面״中間״後面')).toBe('前面 ״中間״ 後面');
    });
  });

  describe('spacing()', () => {
    it('should work with multiple texts sequentially', () => {
      // prettier-ignore
      const results = [
        pangu.spacing('Xcode 7.1配備了全新的AppleTV開發工具'),
        pangu.spacing('新MacBook Pro有15寸和13寸兩個版本'),
        pangu.spacing('ChromeDriver 2.20支援Chrome v43-48')
      ];

      // prettier-ignore
      expect(results).toEqual([
        'Xcode 7.1 配備了全新的 AppleTV 開發工具',
        '新 MacBook Pro 有 15 寸和 13 寸兩個版本',
        'ChromeDriver 2.20 支援 Chrome v43-48',
      ]);
    });
  });

  describe('hasProperSpacing()', () => {
    it('should return true if the text has proper spacing', () => {
      expect(pangu.hasProperSpacing('♫ 每條大街小巷，每個工程師的嘴裡，見面第一句話，就是不要在過年前 Deploy ♫')).toBe(true);
      expect(pangu.hasProperSpacing('♫每條大街小巷，每個工程師的嘴裡，見面第一句話，就是不要在過年前Deploy♫')).toBe(false);
    });
  });
});
