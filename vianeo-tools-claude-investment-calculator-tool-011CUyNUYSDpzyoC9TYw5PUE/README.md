# Innovation Investment Calculator

Professional investment calculator tool for estimating innovation implementation costs with staged funding model and exportable PDF reports.

## Overview

This tool calculates true innovation implementation costs based on 6 user inputs, providing realistic investment requirements with three scenario projections (Optimistic, Realistic, Conservative). It includes a staged funding model to help de-risk investments and generates professional PDF reports suitable for board presentations.

## Features

- **4-Screen User Flow**: Input Form → Results Display → Staged Funding → Export
- **Calculation Engine**: Industry-standard coefficients and formulas
- **Three Scenarios**: Optimistic, Realistic, Conservative projections
- **Staged Funding Model**: 3-phase approach with decision gates
- **PDF Export**: Professional reports with full breakdown
- **Mobile Responsive**: Optimized for all screen sizes
- **WCAG AA Accessible**: Meets accessibility standards

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **PDF Generation**: jsPDF
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
vianeo-tools/
├── src/
│   ├── components/          # React components
│   │   ├── InputForm.tsx   # Screen 1: Input form
│   │   ├── ResultsDisplay.tsx  # Screen 2: Results
│   │   └── StagedFunding.tsx   # Screen 3: Staged funding
│   ├── config/
│   │   └── coefficients.ts # All calculation coefficients
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   ├── utils/
│   │   ├── calculator.ts   # Calculation engine
│   │   └── pdfGenerator.ts # PDF export functionality
│   ├── App.tsx             # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── METHODOLOGY.md          # Detailed methodology document
├── README.md              # This file
└── package.json
```

## User Flow

### Screen 1: Input Form
Users provide 6 required inputs:
1. Technology Type (Software, Hardware, Biotech, Clean Energy)
2. Current Stage (Concept, Prototype, Pilot, Production)
3. Target Market (Enterprise B2B, SMB B2B, Consumer B2C, Government)
4. Geographic Location (20 options with cost indices)
5. Team Status (No team, Partial team, Full team)
6. Regulatory Environment (None, Moderate, Heavy)

### Screen 2: Results Display
Shows three scenarios side-by-side:
- **Optimistic**: Best-case execution
- **Realistic**: Expected case (recommended)
- **Conservative**: Plan for challenges

Each scenario displays:
- Total Investment
- Timeline to Break-Even
- Expandable cost breakdowns (Development, GTM, Risk)

### Screen 3: Staged Funding Model
Visual timeline showing 3 phases:
- **Phase 1 (Validation)**: 25% of investment
- **Phase 2 (Development)**: 50% of investment
- **Phase 3 (Scaling)**: 25% of investment

Each phase includes:
- Investment amount and duration
- Objective and key milestone
- Decision gate criteria

### Screen 4: Export
- Download PDF Report (comprehensive 4-page report)
- Professional formatting suitable for board presentations

## Calculation Methodology

### Core Formula
```
TOTAL = (DEVELOPMENT_COSTS + GTM_COSTS) × (1 + RISK_FACTOR)
```

### Key Components

**Development Costs:**
- Base Technical = Monthly Burn Rate × Development Months × Team Multiplier × Geo Multiplier
- Infrastructure = Base Infrastructure Cost × Geo Multiplier
- Regulatory = Base Regulatory Cost × Geo Multiplier

**GTM Costs:**
- Market Entry = Base Market Entry × Geo Multiplier
- Scaling = Development Costs × 40%

**Risk Factor:**
- Expected Value = Σ(Probability × Impact) for Technical, Market, Regulatory, and Competitive risks

See [METHODOLOGY.md](./METHODOLOGY.md) for detailed formulas and rationale.

## Admin Documentation

### Updating Coefficients

All calculation coefficients are centralized in `src/config/coefficients.ts` for easy updates.

#### Monthly Burn Rates
```typescript
export const MONTHLY_BURN_RATES: Record<TechnologyType, number> = {
  'Software': 75000,
  'Hardware': 95000,
  'Biotech': 125000,
  'Clean Energy': 110000,
};
```

#### Geographic Locations
To add a new location:
```typescript
export const GEOGRAPHIC_LOCATIONS = [
  // ... existing locations
  { name: 'New Location', index: 1.15 },
];
```

#### Development Timeline
Update development months by stage:
```typescript
export const DEVELOPMENT_MONTHS: Record<string, number> = {
  'Concept (TRL 1-3)': 18,
  'Prototype (TRL 4-6)': 12,
  'Pilot (TRL 7-8)': 9,
  'Production (TRL 9)': 6,
};
```

#### Risk Probabilities and Impacts
Update in `coefficients.ts`:
```typescript
export const TECHNICAL_RISK_PROBABILITY: Record<CurrentStage, number> = {
  'Concept (TRL 1-3)': 0.65,
  // ...
};

export const RISK_IMPACTS = {
  technical: 0.25,
  market: 0.20,
  regulatory: 0.15,
  competitive: 0.12,
};
```

### Test Cases

Run these test cases to verify calculations:

#### Test Case 1: Software Prototype
**Inputs:**
- Technology: Software
- Stage: Prototype (TRL 4-6)
- Market: SMB B2B
- Location: Remote US
- Team: Partial team
- Regulatory: None

**Expected Realistic Result:** ~$1.5M

#### Test Case 2: Biotech Pilot
**Inputs:**
- Technology: Biotech
- Stage: Pilot (TRL 7-8)
- Market: Enterprise B2B
- Location: Bay Area
- Team: No team yet
- Regulatory: Heavy (FDA/EPA)

**Expected Realistic Result:** ~$8M

#### Test Case 3: Hardware Production
**Inputs:**
- Technology: Hardware
- Stage: Production (TRL 9)
- Market: Consumer B2C
- Location: Austin
- Team: Full team assembled
- Regulatory: Moderate

**Expected Realistic Result:** ~$2.5M

### Testing Calculations

To verify calculation accuracy:

1. Use the calculator with test case inputs
2. Check that results are within ±10% of expected values
3. Verify all three scenarios calculate correctly
4. Test PDF export generates properly
5. Confirm staged funding totals match realistic scenario

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts to configure project

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

Or use the Netlify CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Environment Variables

No environment variables required. All calculations run client-side.

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari/Chrome: Latest versions

## Performance

- Initial page load: < 2 seconds
- Calculation response: < 500ms
- PDF generation: < 3 seconds
- Mobile-optimized (targets 50% of traffic)

## Accessibility

- WCAG AA compliant
- Keyboard navigable
- Screen reader compatible
- Appropriate ARIA labels
- Sufficient color contrast

## Security & Privacy

- No backend or database required
- All calculations performed client-side
- No data transmission without user consent
- No tracking or analytics by default

## Known Limitations

1. **No user accounts**: Calculations are session-based only
2. **No data persistence**: Results not saved unless user exports PDF
3. **USD only**: All calculations in US dollars
4. **English only**: Single language support
5. **No integrations**: No CRM, analytics dashboard, or payment integration

## Future Enhancements (Not Implemented)

- User accounts and saved calculations
- Email delivery of reports
- Schedule consultation integration
- CRM integration
- Analytics dashboard
- Multi-currency support
- Additional languages
- Custom coefficient overrides

## Troubleshooting

### Build Issues

**Issue**: Tailwind styles not loading
```bash
# Ensure Tailwind is installed
npm install -D tailwindcss postcss autoprefixer

# Verify tailwind.config.js exists and is properly configured
```

**Issue**: TypeScript errors
```bash
# Check tsconfig.json includes all source files
# Verify all dependencies are installed
npm install
```

### Runtime Issues

**Issue**: PDF not generating
- Check browser console for errors
- Verify jsPDF is installed
- Ensure no popup blockers preventing download

**Issue**: Form validation not working
- Verify React Hook Form is installed
- Check all required fields have validation rules

## Contributing

This is a standalone tool. For updates or modifications:

1. Update coefficients in `src/config/coefficients.ts`
2. Test with provided test cases
3. Update METHODOLOGY.md if formulas change
4. Update this README for any new features

## License

Proprietary - All rights reserved

## Support

For questions or issues, contact the development team.

---

**Version:** 1.0
**Last Updated:** November 10, 2024
**Maintained By:** Vianeo Tools Team
