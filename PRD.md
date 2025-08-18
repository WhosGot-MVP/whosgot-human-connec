# WhosGot MVP - Product Requirements Document

WhosGot is a global platform where people post requests (things, help, advice & skills, connections) and others respond, focusing on human connection, social value, and emotional engagement.

**Experience Qualities**:
1. **Human-centered**: Every interaction should feel warm and personal, emphasizing genuine human connection over metrics
2. **Accessible**: Simple, intuitive interface that welcomes all skill levels and backgrounds
3. **Trustworthy**: Clean, reliable design that builds confidence in sharing and responding to requests

**Complexity Level**: Light Application (multiple features with basic state)
- Multi-page application with user authentication, content creation, and social interaction features while maintaining simplicity

## Essential Features

### Landing Page & Hero Section
- **Functionality**: Compelling introduction to WhosGot's purpose and value
- **Purpose**: Convert visitors into engaged users through emotional connection
- **Trigger**: User visits homepage
- **Progression**: View hero → Read manifesto → See examples → Join platform
- **Success criteria**: Clear understanding of platform value and strong call-to-action engagement

### Request Creation System
- **Functionality**: Users can post requests across categories (Things, Help, Advice/Skills, Connections)
- **Purpose**: Enable people to ask for what they need in a structured way
- **Trigger**: Authenticated user clicks "Post a Request"
- **Progression**: Choose category → Write title/description → Add location/tags → Submit → View similar requests
- **Success criteria**: Successful request submission with appropriate categorization

### Response System
- **Functionality**: Users can respond to requests with messages and contact information
- **Purpose**: Facilitate helpful connections between requesters and responders
- **Trigger**: User views request details and clicks respond
- **Progression**: Read request → Write response → Add contact info → Submit → Connection made
- **Success criteria**: Meaningful responses that lead to real-world connections

### Request Discovery
- **Functionality**: Browse, filter, and search requests by category, location, tags
- **Purpose**: Help users find requests they can help with or similar needs
- **Trigger**: User wants to browse available requests
- **Progression**: View feed → Apply filters → Find relevant requests → Respond or connect
- **Success criteria**: Users can efficiently find relevant content

### Authentication & Profiles
- **Functionality**: User accounts with request/response history
- **Purpose**: Build trust and enable ongoing relationships
- **Trigger**: User wants to create request or respond
- **Progression**: Sign up/in → Verify email → Create content → Build profile
- **Success criteria**: Secure, frictionless authentication with persistent identity

## Edge Case Handling
- **Missing environment variables**: Graceful degradation with user-friendly error messages
- **Empty states**: Encouraging messages that guide users toward first actions
- **Network errors**: Retry mechanisms with clear feedback
- **Inappropriate content**: Admin moderation tools and reporting system
- **Mobile responsiveness**: Touch-friendly interface that works across all device sizes

## Design Direction
The design should evoke warmth, trust, and human connection - feeling like a cozy community space rather than a sterile tech platform. Minimal interface serves the content while warm colors and thoughtful typography create emotional resonance.

## Color Selection
Custom palette focused on human warmth and trust.

- **Primary Color**: Warm Red `oklch(0.577 0.245 27.325)` - communicates passion, urgency, and human warmth for calls-to-action
- **Secondary Colors**: Warm beige/cream backgrounds `oklch(0.97 0.02 83.66)` for comfort, soft grays `oklch(0.708 0.004 83.66)` for supporting text
- **Accent Color**: Deeper red `oklch(0.45 0.22 27.325)` for hover states and emphasis
- **Foreground/Background Pairings**: 
  - Background (Warm Beige #FAF9F7): Dark text `oklch(0.145 0 0)` - Ratio 13.2:1 ✓
  - Primary (Warm Red): White text `oklch(1 0 0)` - Ratio 4.8:1 ✓  
  - Card (White): Dark text `oklch(0.145 0 0)` - Ratio 15.5:1 ✓
  - Muted (Light Gray): Medium text `oklch(0.556 0 0)` - Ratio 4.6:1 ✓

## Font Selection
Inter with Open Sans fallback conveys modern accessibility while maintaining human warmth through generous spacing and readable proportions.

- **Typographic Hierarchy**: 
  - H1 (Hero Title): Inter Bold/48px/tight letter spacing
  - H2 (Section Headers): Inter SemiBold/32px/normal spacing  
  - H3 (Card Titles): Inter Medium/20px/normal spacing
  - Body (Main Text): Inter Regular/16px/relaxed line height
  - Small (Metadata): Inter Regular/14px/normal spacing

## Animations
Subtle, purposeful motion that enhances usability without drawing attention to itself, emphasizing the content over the interface.

- **Purposeful Meaning**: Gentle transitions convey warmth and care in interactions
- **Hierarchy of Movement**: CTAs get subtle hover animations, cards have gentle lift effects, page transitions are smooth but fast

## Component Selection
- **Components**: Card (request display), Button (CTAs), Form components (Input, Textarea, Select), Badge (tags), Avatar (user identity), Dialog (responses)
- **Customizations**: Warm color variants for all shadcn components, rounded corners for friendliness, custom tag badge styling
- **States**: Hover states with gentle elevation, focus states with warm accent colors, loading states with skeleton placeholders
- **Icon Selection**: Phosphor icons for their human-friendly, rounded aesthetic
- **Spacing**: Generous padding (6-8 units) for cards, consistent 4-unit gaps between related elements
- **Mobile**: Stacked layouts, larger touch targets (44px minimum), slide-out navigation for categories