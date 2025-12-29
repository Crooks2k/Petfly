import { FlightTicketEntity } from '@flight-search/core/entities';

export function getMockFlightTicket(index: number = 1): FlightTicketEntity {
  const today = new Date();
  const departureDate = new Date(today);
  departureDate.setDate(today.getDate() + 15);

  const returnDate = new Date(departureDate);
  returnDate.setDate(departureDate.getDate() + 7);

  const departureDateStr = departureDate.toISOString().split('T')[0];
  const returnDateStr = returnDate.toISOString().split('T')[0];

  const nextDay = new Date(departureDate);
  nextDay.setDate(departureDate.getDate() + 1);
  const nextDayStr = nextDay.toISOString().split('T')[0];

  const returnNextDay = new Date(returnDate);
  returnNextDay.setDate(returnDate.getDate() + 1);
  const returnNextDayStr = returnNextDay.toISOString().split('T')[0];

  const mockData = [
    {
      price: 715,
      duration1: 220,
      duration2: 500,
      duration3: 80,
      airline: 'TAP Air Portugal',
      airlineCode: 'TP',
      imageUrl: 'https://img.wway.io/pics/root/TP@png?exar=1&rs=fit:200:200',
      dep1: '07:45',
      arr1: '12:30',
      dep2: '16:30',
      arr2: '05:50',
      dep3: '07:55',
      arr3: '10:15',
      retDep1: '08:00',
      retArr1: '09:20',
      retDep2: '14:30',
      retArr2: '22:55',
      retDep3: '01:20',
      retArr3: '06:25',
    },
    {
      price: 450,
      duration1: 180,
      duration2: 420,
      duration3: 90,
      airline: 'Avianca',
      airlineCode: 'AV',
      imageUrl: 'https://img.wway.io/pics/root/AV@png?exar=1&rs=fit:200:200',
      dep1: '09:15',
      arr1: '12:15',
      dep2: '14:00',
      arr2: '21:00',
      dep3: '23:30',
      arr3: '02:00',
      retDep1: '10:15',
      retArr1: '11:35',
      retDep2: '16:00',
      retArr2: '23:00',
      retDep3: '02:45',
      retArr3: '07:15',
    },
    {
      price: 890,
      duration1: 240,
      duration2: 480,
      duration3: 70,
      airline: 'LATAM',
      airlineCode: 'LA',
      imageUrl: 'https://img.wway.io/pics/root/LA@png?exar=1&rs=fit:200:200',
      dep1: '06:00',
      arr1: '10:00',
      dep2: '18:45',
      arr2: '02:45',
      dep3: '05:30',
      arr3: '06:40',
      retDep1: '07:30',
      retArr1: '08:40',
      retDep2: '13:20',
      retArr2: '21:20',
      retDep3: '00:10',
      retArr3: '05:30',
    },
    {
      price: 620,
      duration1: 200,
      duration2: 460,
      duration3: 85,
      airline: 'Copa Airlines',
      airlineCode: 'CM',
      imageUrl: 'https://img.wway.io/pics/root/CM@png?exar=1&rs=fit:200:200',
      dep1: '11:20',
      arr1: '14:40',
      dep2: '17:15',
      arr2: '01:55',
      dep3: '04:20',
      arr3: '05:45',
      retDep1: '09:40',
      retArr1: '11:05',
      retDep2: '15:45',
      retArr2: '00:25',
      retDep3: '03:10',
      retArr3: '08:05',
    },
    {
      price: 550,
      duration1: 190,
      duration2: 440,
      duration3: 95,
      airline: 'Iberia',
      airlineCode: 'IB',
      imageUrl: 'https://img.wway.io/pics/root/IB@png?exar=1&rs=fit:200:200',
      dep1: '08:30',
      arr1: '11:40',
      dep2: '15:20',
      arr2: '22:40',
      dep3: '01:15',
      arr3: '02:50',
      retDep1: '06:50',
      retArr1: '08:25',
      retDep2: '12:10',
      retArr2: '19:30',
      retDep3: '22:15',
      retArr3: '03:20',
    },
  ];

  const data = mockData[index - 1] || mockData[0];

  return {
    flights: [
      {
        flightItems: [
          {
            airlineName: data.airline,
            airlineCode: `${data.airlineCode}001`,
            arrivalTime: `${departureDateStr}T${data.arr1}:00`,
            arrival: 'MIA',
            departure: 'BOG',
            departureTime: `${departureDateStr}T${data.dep1}:00`,
            duration: data.duration1,
            tripClass: 'Economy',
            imageUrl: data.imageUrl,
          },
          {
            airlineName: data.airline,
            airlineCode: `${data.airlineCode}002`,
            arrivalTime: `${nextDayStr}T${data.arr2}:00`,
            arrival: 'LIS',
            departure: 'MIA',
            departureTime: `${departureDateStr}T${data.dep2}:00`,
            duration: data.duration2,
            tripClass: 'Economy',
            imageUrl: data.imageUrl,
          },
          {
            airlineName: data.airline,
            airlineCode: `${data.airlineCode}003`,
            arrivalTime: `${nextDayStr}T${data.arr3}:00`,
            arrival: 'MAD',
            departure: 'LIS',
            departureTime: `${nextDayStr}T${data.dep3}:00`,
            duration: data.duration3,
            tripClass: 'Economy',
            imageUrl: data.imageUrl,
          },
        ],
      },
      {
        flightItems: [
          {
            airlineName: data.airline,
            airlineCode: `${data.airlineCode}101`,
            arrivalTime: `${returnDateStr}T${data.retArr1}:00`,
            arrival: 'LIS',
            departure: 'MAD',
            departureTime: `${returnDateStr}T${data.retDep1}:00`,
            duration: 80,
            tripClass: 'Economy',
            imageUrl: data.imageUrl,
          },
          {
            airlineName: data.airline,
            airlineCode: `${data.airlineCode}102`,
            arrivalTime: `${returnNextDayStr}T${data.retArr2}:00`,
            arrival: 'MIA',
            departure: 'LIS',
            departureTime: `${returnDateStr}T${data.retDep2}:00`,
            duration: 485,
            tripClass: 'Economy',
            imageUrl: data.imageUrl,
          },
          {
            airlineName: data.airline,
            airlineCode: `${data.airlineCode}103`,
            arrivalTime: `${returnNextDayStr}T${data.retArr3}:00`,
            arrival: 'BOG',
            departure: 'MIA',
            departureTime: `${returnNextDayStr}T${data.retDep3}:00`,
            duration: 245,
            tripClass: 'Economy',
            imageUrl: data.imageUrl,
          },
        ],
      },
    ],
    maxStops: 2,
    maxStopDuration: 240,
    price: data.price,
    currency: 'USD',
    isDirect: false,
    mrPrice: { min: 200, max: 200, currency: 'USD' },
    aePrice: { min: 50, max: 100, currency: 'USD' },
    psPrice: { min: 0, max: 0, currency: 'USD' },
    total: { min: data.price * 2 + 200, max: data.price * 2 + 400, currency: 'USD' },
  };
}
