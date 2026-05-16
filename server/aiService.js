import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeStoolImage(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `你是一位专业的兽医。请分析这张小狗大便图片，从以下几个方面给出评估：
1. 颜色状态（正常/异常）
2. 质地稠度（硬/正常/软/水样）
3. 形状完整性（成形良好/略软/不成形）
4. 寄生虫或异物迹象
5. 总体健康状态评估

请用JSON格式返回，包含以下字段：
- status: 健康状态（健康/轻微异常/需要关注/需立即就医）
- analysis: 详细分析描述
- suggestions: 饮食或护理建议
- color: 颜色评估
- texture: 质地评估
- shape: 形状评估

请只返回JSON，不要有其他文字。`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('无法解析AI返回结果');
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      status: '分析失败',
      analysis: '图片分析失败，请稍后重试。',
      suggestions: '建议：保持观察，如有异常持续请咨询兽医。',
      color: '未知',
      texture: '未知',
      shape: '未知'
    };
  }
}
