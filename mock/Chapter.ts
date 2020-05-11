export const genChapters = (offset: number, length: number) => {
  let res: any[] = [];
  for (let i = 1; i <= length; i++) {
    res.push({
      id: `chapter${offset + i}`,
      title: `chapter${offset + i}`,
      date: new Date().toString(),
      content:
        "2011年10月13日 2岁的小悦悦在相继被两车碾压。7分钟内，18名路人路过但都视而不见，漠然而去。最后是拾荒阿姨陈贤妹上前施以援手。2011年10月21日，小悦悦经医院全力抢救无效，在零时32分离世。2018年10月25日 ...... 当这些新闻都罗列在一起的时候，你是什么感受？库管的感受是——毛骨悚然。想起的是鲁迅先生笔下的“看客”们：于是他背后的人们须竭力伸长脖子，有一个瘦子竟至于连嘴都张得很大，像一条死舻鱼。却只见一堆人的后背，颈项都伸得很长，仿佛好多鸭，被无形的手捏住了的，向上提着"
    });
  }
  return res;
};

export const hots = genChapters(0, 20);
