export async function GET() {
  try {
    // Sample analytics data
    const analyticsData = {
      projectsByStage: [
        { stage: 'Briefed', count: 1 },
        { stage: 'Approved', count: 1 },
        { stage: 'In Print', count: 1 },
        { stage: 'Packed', count: 1 },
        { stage: 'Dispatched', count: 1 },
      ],
      onTimeDelivery: {
        onTime: 92,
        late: 8,
      },
      projectsOverview: [
        {
          risk: 'high',
          client: 'Evergreen Co.',
          project: 'Rigid Box Packaging',
          stage: 'In Print',
          dueDate: 'Nov 15, 2023',
          nextAction: 'Monitor printing and prepare for packing.',
        },
        {
          risk: 'medium',
          client: 'Bloom & Bud',
          project: 'Luxury Gift Set',
          stage: 'In Proofing',
          dueDate: 'Dec 1, 2023',
          nextAction: 'Awaiting foil feedback from client.',
        },
        {
          risk: 'high',
          client: 'Tech Innovate',
          project: 'Folding Carton',
          stage: 'Approved',
          dueDate: 'Dec 10, 2023',
          nextAction: 'Schedule for printing next week.',
        },
        {
          risk: 'low',
          client: 'Artisan Goods',
          project: 'Product Labels',
          stage: 'Briefed',
          dueDate: 'Nov 25, 2023',
          nextAction: 'Awaiting artwork from client designer.',
        },
        {
          risk: 'none',
          client: 'Global Exports',
          project: 'Shipping Cartons',
          stage: 'Dispatched',
          dueDate: 'Oct 30, 2023',
          nextAction: 'Project complete. Follow up for invoicing.',
        },
      ],
    };
    return new Response(JSON.stringify(analyticsData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response('Server Error', { status: 500 });
  }
}
