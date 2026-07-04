export const QUIZ_STEPS = [
  {
    key: 'budget',
    title: 'What is your budget?',
    subtitle: 'On-road price you are comfortable with',
    type: 'single',
    options: [
      { value: 'under-8', label: 'Under ₹8 lakh' },
      { value: '8-12',    label: '₹8 – 12 lakh' },
      { value: '12-18',   label: '₹12 – 18 lakh' },
      { value: '18-25',   label: '₹18 – 25 lakh' },
    ],
  },
  {
    key: 'primaryUse',
    title: 'How will you mainly use the car?',
    subtitle: 'Pick the option that fits your lifestyle best',
    type: 'single',
    options: [
      { value: 'city-commute',  label: 'Daily city commute' },
      { value: 'family-trips',  label: 'Family trips & weekend getaways' },
      { value: 'highway',       label: 'Long highway drives' },
      { value: 'mixed',         label: 'A mix of everything' },
    ],
  },
  {
    key: 'priorities',
    title: 'What matters most to you?',
    subtitle: 'Pick exactly 2 priorities',
    type: 'multi2',
    options: [
      { value: 'efficiency', label: 'Fuel efficiency / low running cost' },
      { value: 'safety',     label: 'Safety ratings & features' },
      { value: 'power',      label: 'Powerful engine / fun to drive' },
      { value: 'space',      label: 'Space & comfort' },
      { value: 'tech',       label: 'Latest tech & features' },
    ],
  },
  {
    key: 'fuel',
    title: 'Preferred fuel type?',
    subtitle: 'We will filter to your fuel preference',
    type: 'single',
    options: [
      { value: 'Petrol',        label: 'Petrol' },
      { value: 'Diesel',        label: 'Diesel' },
      { value: 'Electric',      label: 'Electric' },
      { value: 'CNG',           label: 'CNG' },
      { value: 'no-preference', label: 'No preference' },
    ],
  },
  {
    key: 'transmission',
    title: 'Manual or automatic?',
    subtitle: 'Your preferred gearbox type',
    type: 'single',
    options: [
      { value: 'Manual',        label: 'Manual' },
      { value: 'Automatic',     label: 'Automatic' },
      { value: 'no-preference', label: 'No preference' },
    ],
  },
];
