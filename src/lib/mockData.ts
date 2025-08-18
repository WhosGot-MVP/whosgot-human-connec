import { Request, Response, Category, Tag } from './types';

// Mock data for demonstration
export const MOCK_REQUESTS: Request[] = [
  {
    id: '1',
    authorId: 'user1',
    title: 'Looking for an old VHS player to show my kids our wedding video from 2001',
    description: 'We found our wedding tape but have no way to play it. Would love to show our children this special memory. Happy to pick up anywhere in the city!',
    category: 'THINGS' as Category,
    tag: 'HEARTWARMING' as Tag,
    location: 'Seattle, WA',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    authorId: 'user2',
    title: 'Does anyone have a spare winter coat for a 10-year old boy?',
    description: 'We just moved and our son grew out of his coat. Looking for something warm for the upcoming winter. Any condition is fine!',
    category: 'THINGS' as Category,
    tag: 'URGENT' as Tag,
    location: 'Minneapolis, MN',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    authorId: 'user3',
    title: 'Searching for advice from someone who started a small bakery business',
    description: 'I\'m thinking about opening a neighborhood bakery but have no experience. Would love to hear from someone who\'s been through this journey - what worked, what didn\'t, and how did you find your first customers?',
    category: 'ADVICE_SKILLS' as Category,
    tag: null,
    location: 'Portland, OR',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    authorId: 'user4',
    title: 'Need help with medical bills - any resources or advice?',
    description: 'Struggling with hospital expenses after an unexpected surgery. Every option helps - any advice on programs, resources, or organizations that might help?',
    category: 'HELP' as Category,
    tag: 'URGENT' as Tag,
    location: 'Phoenix, AZ',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    authorId: 'user5',
    title: 'Looking for a vintage wedding dress from the 70s to borrow',
    description: 'Planning a themed photo shoot and would love to borrow an authentic 70s wedding dress. Will take excellent care of it and return it professionally cleaned!',
    category: 'THINGS' as Category,
    tag: 'RARE_FIND' as Tag,
    location: 'Austin, TX',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    authorId: 'user6',
    title: 'Anyone have a photo of Phil & Eddie\'s Diner in Sedona from the 90s?',
    description: 'I used to love this place during my school years, and now living in New York I miss it. Would love to see how it looks today or any old photos if anyone has them!',
    category: 'CONNECTIONS' as Category,
    tag: 'HEARTWARMING' as Tag,
    location: 'New York, NY',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_RESPONSES: Response[] = [
  {
    id: 'r1',
    requestId: '1',
    authorId: 'responder1',
    message: 'I\'ve got one in my basement! Haven\'t used it in years, but it still works fine. Happy to lend it so your kids can see those memories on screen.',
    contact: 'sarah.k@email.com',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r2',
    requestId: '5',
    authorId: 'responder2',
    message: 'My aunt still has hers! It\'s in great condition — lace and all. I can lend it to you for the shoot, would love to see it come to life again.',
    contact: 'vintage.mary@gmail.com',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'r3',
    requestId: '6',
    authorId: 'responder3',
    message: 'Hey, I live near Sedona! That diner isn\'t there anymore — now it\'s a Mexican restaurant. Snapped a photo for you today. Sending you some warm Sedona sun ☀️',
    contact: 'sedona.local@yahoo.com',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Demo static examples for the homepage
export const DEMO_EXAMPLES = [
  {
    question: "WhosGot a vintage wedding dress from the 70s I could borrow for a themed photo shoot?",
    answer: "My aunt still has hers! It's in great condition — lace and all. I can lend it to you for the shoot, would love to see it come to life again."
  },
  {
    question: "WhosGot a spare VHS player so I can show my kids our wedding tape?",
    answer: "I've got one in my basement. Haven't used it in years, but it still works fine. Happy to lend it so your kids can see those memories on screen."
  },
  {
    question: "WhosGot a photo of Phil & Eddie's Diner in Sedona from the 90s? I used to love this place in my school years, and now living in New York I miss it and would love to see how it looks today.",
    answer: "Hey, I live near Sedona! That diner isn't there anymore — now it's a Mexican restaurant. Snapped a photo for you today. Sending you some warm Sedona sun ☀️."
  }
];