# WhosGot MVP - Product Requirements Document

WhosGot is a global platform where people post requests (things, help, advice & skills, connections) and others respond, focusing on human connection, social value, and emotional engagement.


1. **Human-centered**: Every interaction should feel warm and personal, emphasizing genuine human connection over metrics
2. **Accessible**: Simple, intuitive interface that welcomes all skill levels and backgrounds
3. **Trustworthy**: Clean, reliable design that builds confidence in sharing and responding to requests

- **Progression**: View hero → Read manifesto → See examples → Join platform


- **Trigger**: Authen

### Response System
- **Purpose**: Facilitate helpful connections between requesters and respon
- **Progression**: Read request → Write response → Add contact info → Submit → 

- **Progression**: View hero → Read manifesto → See examples → Join platform
- **Trigger**: User wants to browse available requests

### Authentication & Profil
- **Purpose**: Build trust and enable ongoing relationships
- **Progression**: Sign up/in → Verify email → Create content → Build prof

- **Missing environment variables**: Graceful degradation with user-friendly error messages
- **Network errors**: Retry mechanisms with clear feedback

### Response System

Custom palette focused on human warmth and trust.
- **Primary Color**: Warm Red `oklch(0.577 0.245 27.325)` - 
- **Accent Color**: Deeper red `oklch(0.45 0.22 27.325)` for hover states and emphasis
  - Background (Warm Beige #FAF9F7): Dark text `oklch(0.145 0 0)` - Ratio 13.2:1


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





















