import { Share } from 'react-native';

export async function shareItineraryDetails(title: string, pnr: string, route: string, date: string) {
  try {
    const message = `*Schedura Itinerary Confirmation*\nTrip: ${title}\nRoute: ${route}\nDate: ${date}\nPNR: ${pnr}\n\nOrganized via Schedura Smart Travel`;
    await Share.share({
      title: 'Schedura Travel Itinerary',
      message,
    });
  } catch (error) {
    console.warn('Sharing failed:', error);
  }
}
