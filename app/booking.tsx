import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { borderRadius } from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Train, Hotel, CLASS_OPTIONS, ClassKey } from '@/data/mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomDigits(n: number): string {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('');
}

type TrainStep = 'class' | 'passenger' | 'payment' | 'confirm';
type HotelStep = 'guest' | 'payment' | 'confirm';
type AnyStep = TrainStep | HotelStep;

const TRAIN_STEPS: TrainStep[] = ['class', 'passenger', 'payment', 'confirm'];
const HOTEL_STEPS: HotelStep[] = ['guest', 'payment', 'confirm'];

const TRAIN_STEP_LABELS = ['Class', 'Passenger', 'Payment', 'Done'];
const HOTEL_STEP_LABELS = ['Details', 'Payment', 'Done'];

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, labels, c }: {
  current: number; labels: string[]; c: ReturnType<typeof useColors>;
}) {
  return (
    <View style={siStyles.row}>
      {labels.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <View style={siStyles.stepWrap}>
              <View style={[
                siStyles.circle,
                { borderColor: done || active ? c.primary : c.border },
                (done || active) && { backgroundColor: done ? c.success : c.primary },
              ]}>
                {done
                  ? <Feather name="check" size={13} color="#fff" />
                  : <Text style={[siStyles.num, { color: active ? '#fff' : c.mutedForeground }]}>{i + 1}</Text>
                }
              </View>
              <Text style={[siStyles.label, { color: active ? c.primary : c.mutedForeground }]}>{label}</Text>
            </View>
            {i < labels.length - 1 && (
              <View style={[siStyles.line, { backgroundColor: i < current ? c.primary : c.border }]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const siStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 16 },
  stepWrap: { alignItems: 'center', gap: 4, minWidth: 48 },
  circle: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 12, fontWeight: '700' },
  label: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  line: { flex: 1, height: 2, marginBottom: 18, marginHorizontal: 2 },
});

// ─── Payment Methods ───────────────────────────────────────────────────────────

type PayMethod = 'upi' | 'card' | 'netbanking';

function PaymentStep({
  total, c, onPay,
}: { total: number; c: ReturnType<typeof useColors>; onPay: () => void }) {
  const [method, setMethod] = useState<PayMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [paying, setPaying] = useState(false);

  const handlePay = () => {
    if (paying) return;
    if (method === 'upi' && !upiId.trim()) {
      Alert.alert('UPI ID Required', 'Please enter your UPI ID to continue.');
      return;
    }
    setPaying(true);
    setTimeout(() => { setPaying(false); onPay(); }, 2000);
  };

  const methodOptions: { key: PayMethod; label: string; icon: any }[] = [
    { key: 'upi', label: 'UPI / PhonePe / GPay', icon: 'smartphone' },
    { key: 'card', label: 'Credit / Debit Card', icon: 'credit-card' },
    { key: 'netbanking', label: 'Net Banking', icon: 'globe' },
  ];

  const s = payStyles(c);
  return (
    <View style={s.wrap}>
      {/* Fare Breakdown */}
      <View style={[s.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[s.cardTitle, { color: c.text }]}>Fare Breakdown</Text>
        {[
          { label: 'Base Fare', amount: Math.round(total / 1.05 - 30) },
          { label: 'GST (5%)', amount: Math.round((total - 30) * 0.05 / 1.05) },
          { label: 'Convenience Fee', amount: 30 },
        ].map(row => (
          <View key={row.label} style={s.fareRow}>
            <Text style={[s.fareLabel, { color: c.mutedForeground }]}>{row.label}</Text>
            <Text style={[s.fareAmt, { color: c.text }]}>₹{row.amount}</Text>
          </View>
        ))}
        <View style={[s.divider, { backgroundColor: c.border }]} />
        <View style={s.fareRow}>
          <Text style={[s.fareTotalLabel, { color: c.text }]}>Total Amount</Text>
          <Text style={[s.fareTotalAmt, { color: c.primary }]}>₹{total}</Text>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={[s.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[s.cardTitle, { color: c.text }]}>Payment Method</Text>
        {methodOptions.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[s.methodRow, { borderColor: method === opt.key ? c.primary : c.border },
              method === opt.key && { backgroundColor: c.secondary }]}
            onPress={() => setMethod(opt.key)}
            activeOpacity={0.8}
          >
            <View style={[s.radio, { borderColor: method === opt.key ? c.primary : c.mutedForeground }]}>
              {method === opt.key && <View style={[s.radioInner, { backgroundColor: c.primary }]} />}
            </View>
            <Feather name={opt.icon} size={16} color={method === opt.key ? c.primary : c.mutedForeground} />
            <Text style={[s.methodLabel, { color: c.text }]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}

        {method === 'upi' && (
          <TextInput
            style={[s.upiInput, { backgroundColor: c.muted, borderColor: c.border, color: c.text }]}
            placeholder="Enter UPI ID (e.g. name@upi)"
            placeholderTextColor={c.mutedForeground}
            value={upiId}
            onChangeText={setUpiId}
            autoCapitalize="none"
          />
        )}
      </View>

      {/* Demo Notice */}
      <View style={[s.noticeBanner, { backgroundColor: c.warningLight, borderColor: c.warning }]}>
        <Feather name="alert-triangle" size={15} color={c.warning} />
        <Text style={[s.noticeText, { color: c.text }]}>
          This is a demo — no real payment will be made.
        </Text>
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={[s.payBtn, { backgroundColor: c.primary }]}
        onPress={handlePay}
        disabled={paying}
        activeOpacity={0.85}
      >
        {paying ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Feather name="lock" size={16} color="#fff" />
            <Text style={s.payBtnText}>Pay ₹{total} (Demo)</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const payStyles = (c: ReturnType<typeof useColors>) => StyleSheet.create({
  wrap: { gap: 16 },
  card: { borderRadius: borderRadius, borderWidth: 1, padding: 16, gap: 10 },
  cardTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between' },
  fareLabel: { fontSize: 14 },
  fareAmt: { fontSize: 14 },
  divider: { height: 1, marginVertical: 6 },
  fareTotalLabel: { fontSize: 16, fontWeight: '800' },
  fareTotalAmt: { fontSize: 18, fontWeight: '900' },
  methodRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 10, borderWidth: 1.5, padding: 12,
  },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 8, height: 8, borderRadius: 4 },
  methodLabel: { fontSize: 14, fontWeight: '600', flex: 1 },
  upiInput: {
    borderRadius: 10, borderWidth: 1, paddingHorizontal: 12,
    paddingVertical: 10, fontSize: 14, marginTop: 4,
  },
  noticeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 10, borderWidth: 1, padding: 12,
  },
  noticeText: { fontSize: 13, flex: 1, lineHeight: 18 },
  payBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: borderRadius, paddingVertical: 16,
  },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

// ─── Main Booking Screen ──────────────────────────────────────────────────────

export default function BookingScreen() {
  const c = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ type: string; data: string; from?: string; to?: string; date?: string }>();
  const { addTrip } = useApp();

  const type = params.type as 'train' | 'hotel';
  const train: Train | null = type === 'train' ? JSON.parse(params.data ?? '{}') : null;
  const hotel: Hotel | null = type === 'hotel' ? JSON.parse(params.data ?? '{}') : null;
  const from = params.from ?? '';
  const to = params.to ?? '';
  const travelDate = params.date ?? new Date().toISOString().split('T')[0];

  const steps = type === 'train' ? TRAIN_STEPS : HOTEL_STEPS;
  const stepLabels = type === 'train' ? TRAIN_STEP_LABELS : HOTEL_STEP_LABELS;
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];

  // Class selection (trains)
  const [selectedClass, setSelectedClass] = useState<ClassKey>('sleeper');

  // Passenger / Guest details
  const [passengerName, setPassengerName] = useState('');
  const [passengerAge, setPassengerAge] = useState('');
  const [passengerGender, setPassengerGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [checkinDate, setCheckinDate] = useState(travelDate);
  const [checkoutDate, setCheckoutDate] = useState('');

  // Confirmation
  const [pnr] = useState(randomDigits(10));
  const [bookingId] = useState('SCH' + randomDigits(8));
  const [booked, setBooked] = useState(false);

  const totalPrice = train
    ? Math.round(train.price[selectedClass] * 1.05 + 30)
    : Math.round((hotel?.pricePerNight ?? 0) * 1.05 + 30);

  const validatePassenger = () => {
    if (!passengerName.trim()) { Alert.alert('Required', 'Please enter passenger name.'); return false; }
    if (type === 'train') {
      if (!passengerAge || isNaN(Number(passengerAge))) { Alert.alert('Required', 'Please enter a valid age.'); return false; }
    }
    if (!passengerPhone || passengerPhone.length !== 10) { Alert.alert('Required', 'Please enter a valid 10-digit phone number.'); return false; }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 'passenger' || currentStep === 'guest') {
      if (!validatePassenger()) return;
    }
    setStepIndex(i => Math.min(i + 1, steps.length - 1));
  };

  const handleConfirmBooking = useCallback(() => {
    if (booked) return;
    setBooked(true);

    const now = new Date().toISOString();
    const trip = type === 'train'
      ? {
          id: `trip-${Date.now()}`,
          title: `${from} → ${to}`,
          from, to,
          departureDate: travelDate,
          train: train!,
          status: 'upcoming' as const,
          notes: `Booked via Schedura Demo. PNR: ${pnr}. Passenger: ${passengerName}. Class: ${CLASS_OPTIONS.find(c => c.key === selectedClass)?.label}. Amount: ₹${totalPrice}.`,
          createdAt: now,
        }
      : {
          id: `trip-${Date.now()}`,
          title: `Hotel in ${hotel!.city}`,
          from: hotel!.city, to: hotel!.city,
          departureDate: checkinDate,
          hotel: hotel!,
          checkinDate,
          checkoutDate,
          status: 'upcoming' as const,
          notes: `Booked via Schedura Demo. Booking ID: ${bookingId}. Guest: ${passengerName}. Guests: ${guestCount}. Amount: ₹${totalPrice}.`,
          createdAt: now,
        };

    addTrip(trip);
    setStepIndex(steps.length - 1);
  }, [booked, type, from, to, travelDate, train, hotel, pnr, passengerName, selectedClass, totalPrice, checkinDate, checkoutDate, bookingId, guestCount, addTrip, steps.length]);

  const s = styles(c);
  const isLastStep = stepIndex === steps.length - 1;
  const isConfirmStep = currentStep === 'confirm';
  const isPaymentStep = currentStep === 'payment';

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={c.background} />

      {/* Nav Header */}
      <View style={[s.navHeader, { backgroundColor: c.card, borderBottomColor: c.border }]}>
        {!isConfirmStep ? (
          <TouchableOpacity onPress={() => stepIndex > 0 ? setStepIndex(i => i - 1) : router.back()} style={s.backBtn}>
            <Feather name="arrow-left" size={22} color={c.text} />
          </TouchableOpacity>
        ) : <View style={s.backBtn} />}
        <Text style={[s.navTitle, { color: c.text }]}>
          {type === 'train' ? 'Book Train' : 'Book Hotel'}
        </Text>
        <View style={s.backBtn} />
      </View>

      {/* Step Indicator */}
      <StepIndicator current={stepIndex} labels={stepLabels} c={c} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── STEP: Class (Train) ── */}
          {currentStep === 'class' && train && (
            <View style={s.stepSection}>
              <View style={[s.trainInfoCard, { backgroundColor: c.secondary }]}>
                <Text style={[s.trainName, { color: c.text }]}>{train.name} #{train.number}</Text>
                <Text style={[s.trainRoute, { color: c.primary }]}>
                  {train.departure} ({from}) → {train.arrival} ({to})
                </Text>
                <Text style={[s.trainDuration, { color: c.mutedForeground }]}>{train.duration}</Text>
              </View>

              <Text style={[s.stepTitle, { color: c.text }]}>Select Travel Class</Text>
              {CLASS_OPTIONS.map(cls => {
                const price = train.price[cls.key as ClassKey];
                const seats = train.seats[cls.key as ClassKey];
                const selected = selectedClass === cls.key;
                const seatColor = seats === 0 ? c.destructive : seats <= 20 ? c.warning : c.success;
                return (
                  <TouchableOpacity
                    key={cls.key}
                    style={[s.classCard, { borderColor: selected ? c.primary : c.border },
                      selected && { backgroundColor: c.infoLight }]}
                    onPress={() => setSelectedClass(cls.key as ClassKey)}
                    activeOpacity={0.85}
                  >
                    <View style={[s.radio2, { borderColor: selected ? c.primary : c.mutedForeground }]}>
                      {selected && <View style={[s.radioInner2, { backgroundColor: c.primary }]} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.className, { color: c.text }]}>{cls.label}</Text>
                      <Text style={{ color: seatColor, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                        {seats === 0 ? 'Not available' : `${seats} seats available`}
                      </Text>
                    </View>
                    <Text style={[s.classPrice, { color: c.primary }]}>₹{price}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ── STEP: Passenger Details (Train) ── */}
          {currentStep === 'passenger' && (
            <View style={s.stepSection}>
              <Text style={[s.stepTitle, { color: c.text }]}>Passenger Details</Text>

              {[
                { label: 'Full Name *', value: passengerName, set: setPassengerName, placeholder: 'As on ID', type: 'default' as const },
                { label: 'Age *', value: passengerAge, set: setPassengerAge, placeholder: 'e.g. 25', type: 'numeric' as const },
                { label: 'Phone *', value: passengerPhone, set: setPassengerPhone, placeholder: '10-digit mobile', type: 'phone-pad' as const },
                { label: 'Email', value: passengerEmail, set: setPassengerEmail, placeholder: 'optional', type: 'email-address' as const },
              ].map(f => (
                <View key={f.label} style={s.field}>
                  <Text style={[s.fieldLabel, { color: c.mutedForeground }]}>{f.label}</Text>
                  <TextInput
                    style={[s.fieldInput, { backgroundColor: c.card, borderColor: c.border, color: c.text }]}
                    value={f.value}
                    onChangeText={f.set}
                    placeholder={f.placeholder}
                    placeholderTextColor={c.mutedForeground}
                    keyboardType={f.type}
                    maxLength={f.type === 'phone-pad' ? 10 : undefined}
                  />
                </View>
              ))}

              <View style={s.field}>
                <Text style={[s.fieldLabel, { color: c.mutedForeground }]}>Gender</Text>
                <View style={s.genderRow}>
                  {(['Male', 'Female', 'Other'] as const).map(g => (
                    <TouchableOpacity
                      key={g}
                      style={[s.genderBtn, { borderColor: passengerGender === g ? c.primary : c.border },
                        passengerGender === g && { backgroundColor: c.primary }]}
                      onPress={() => setPassengerGender(g)}
                    >
                      <Text style={{ color: passengerGender === g ? '#fff' : c.text, fontSize: 13, fontWeight: '600' }}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* ── STEP: Guest Details (Hotel) ── */}
          {currentStep === 'guest' && (
            <View style={s.stepSection}>
              <Text style={[s.stepTitle, { color: c.text }]}>Guest Details</Text>
              {hotel && (
                <View style={[s.trainInfoCard, { backgroundColor: c.secondary }]}>
                  <Text style={[s.trainName, { color: c.text }]}>{hotel.name}</Text>
                  <Text style={[s.trainRoute, { color: c.primary }]}>₹{hotel.pricePerNight}/night</Text>
                </View>
              )}

              {[
                { label: 'Full Name *', value: passengerName, set: setPassengerName, placeholder: 'Lead guest name', type: 'default' as const },
                { label: 'Phone *', value: passengerPhone, set: setPassengerPhone, placeholder: '10-digit mobile', type: 'phone-pad' as const },
                { label: 'Email', value: passengerEmail, set: setPassengerEmail, placeholder: 'optional', type: 'email-address' as const },
                { label: 'Check-in Date', value: checkinDate, set: setCheckinDate, placeholder: 'YYYY-MM-DD', type: 'default' as const },
                { label: 'Check-out Date', value: checkoutDate, set: setCheckoutDate, placeholder: 'YYYY-MM-DD', type: 'default' as const },
                { label: 'Number of Guests', value: guestCount, set: setGuestCount, placeholder: '1', type: 'numeric' as const },
              ].map(f => (
                <View key={f.label} style={s.field}>
                  <Text style={[s.fieldLabel, { color: c.mutedForeground }]}>{f.label}</Text>
                  <TextInput
                    style={[s.fieldInput, { backgroundColor: c.card, borderColor: c.border, color: c.text }]}
                    value={f.value}
                    onChangeText={f.set}
                    placeholder={f.placeholder}
                    placeholderTextColor={c.mutedForeground}
                    keyboardType={f.type}
                  />
                </View>
              ))}
            </View>
          )}

          {/* ── STEP: Payment ── */}
          {currentStep === 'payment' && (
            <View style={s.stepSection}>
              <Text style={[s.stepTitle, { color: c.text }]}>Payment</Text>
              <PaymentStep total={totalPrice} c={c} onPay={handleConfirmBooking} />
            </View>
          )}

          {/* ── STEP: Confirmation ── */}
          {currentStep === 'confirm' && (
            <View style={s.confirmSection}>
              <View style={[s.checkCircle, { backgroundColor: c.success }]}>
                <Feather name="check" size={40} color="#fff" />
              </View>
              <Text style={[s.confirmTitle, { color: c.text }]}>Booking Confirmed!</Text>
              <Text style={[s.confirmSub, { color: c.mutedForeground }]}>
                Your trip has been added to My Trips
              </Text>

              {type === 'train' && (
                <>
                  <Text style={[s.pnrLabel, { color: c.mutedForeground }]}>PNR Number</Text>
                  <Text style={[s.pnrNumber, { color: c.primary }]}>{pnr}</Text>
                </>
              )}

              <Text style={[s.bookingIdText, { color: c.mutedForeground }]}>Booking ID: {bookingId}</Text>

              {/* Summary Card */}
              <View style={[s.summaryCard, { backgroundColor: c.card, borderColor: c.border }]}>
                {type === 'train' && train ? (
                  <>
                    <SummaryRow label="Train" value={train.name} c={c} />
                    <SummaryRow label="Route" value={`${from} → ${to}`} c={c} />
                    <SummaryRow label="Date" value={travelDate} c={c} />
                    <SummaryRow label="Passenger" value={passengerName} c={c} />
                    <SummaryRow label="Class" value={CLASS_OPTIONS.find(x => x.key === selectedClass)?.label ?? ''} c={c} />
                    <SummaryRow label="Amount Paid" value={`₹${totalPrice}`} c={c} bold />
                  </>
                ) : hotel ? (
                  <>
                    <SummaryRow label="Hotel" value={hotel.name} c={c} />
                    <SummaryRow label="City" value={hotel.city} c={c} />
                    <SummaryRow label="Check-in" value={checkinDate} c={c} />
                    {checkoutDate ? <SummaryRow label="Check-out" value={checkoutDate} c={c} /> : null}
                    <SummaryRow label="Guest" value={passengerName} c={c} />
                    <SummaryRow label="Amount Paid" value={`₹${totalPrice}`} c={c} bold />
                  </>
                ) : null}
              </View>

              <TouchableOpacity
                style={[s.confirmBtn, { backgroundColor: c.primary }]}
                onPress={() => router.replace('/(tabs)/trips')}
                activeOpacity={0.85}
              >
                <Feather name="briefcase" size={16} color="#fff" />
                <Text style={s.confirmBtnText}>View in My Trips</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.confirmBtnOutline, { borderColor: c.border }]}
                onPress={() => router.replace('/')}
                activeOpacity={0.85}
              >
                <Feather name="home" size={16} color={c.text} />
                <Text style={[s.confirmBtnOutlineText, { color: c.text }]}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Bottom CTA */}
      {!isConfirmStep && !isPaymentStep && (
        <View style={[s.bottomBar, { backgroundColor: c.card, borderTopColor: c.border }]}>
          <View style={s.priceWrap}>
            <Text style={[s.priceLabel, { color: c.mutedForeground }]}>Total</Text>
            <Text style={[s.priceValue, { color: c.primary }]}>₹{totalPrice}</Text>
          </View>
          <TouchableOpacity
            style={[s.ctaBtn, { backgroundColor: c.primary }]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={s.ctaBtnText}>
              {stepIndex === steps.length - 2 ? 'Proceed to Pay' : 'Continue'}
            </Text>
            <Feather name="arrow-right" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, c, bold }: {
  label: string; value: string; c: ReturnType<typeof useColors>; bold?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={{ color: c.mutedForeground, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: c.text, fontSize: 13, fontWeight: bold ? '800' : '600', flex: 1, textAlign: 'right' }} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = (c: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    navHeader: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 12, paddingVertical: 14, borderBottomWidth: 1,
    },
    backBtn: { width: 40, alignItems: 'center' },
    navTitle: { fontSize: 17, fontWeight: '800' },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 40 },
    stepSection: { paddingHorizontal: 20, gap: 14 },
    stepTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
    trainInfoCard: { borderRadius: borderRadius, padding: 14, gap: 4 },
    trainName: { fontSize: 15, fontWeight: '800' },
    trainRoute: { fontSize: 14, fontWeight: '600' },
    trainDuration: { fontSize: 12 },
    classCard: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      borderRadius: borderRadius, borderWidth: 2, padding: 14,
    },
    radio2: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    radioInner2: { width: 9, height: 9, borderRadius: 4.5 },
    className: { fontSize: 15, fontWeight: '700' },
    classPrice: { fontSize: 18, fontWeight: '900' },
    field: { gap: 6 },
    fieldLabel: { fontSize: 12, fontWeight: '600', marginLeft: 2 },
    fieldInput: { borderRadius: borderRadius, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15 },
    genderRow: { flexDirection: 'row', gap: 10 },
    genderBtn: { flex: 1, alignItems: 'center', borderRadius: 10, borderWidth: 1.5, paddingVertical: 10 },
    confirmSection: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, gap: 12 },
    checkCircle: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    confirmTitle: { fontSize: 26, fontWeight: '900', textAlign: 'center' },
    confirmSub: { fontSize: 15, textAlign: 'center' },
    pnrLabel: { fontSize: 13, fontWeight: '600', marginTop: 8 },
    pnrNumber: { fontSize: 30, fontWeight: '900', letterSpacing: 4 },
    bookingIdText: { fontSize: 12 },
    summaryCard: { width: '100%', borderRadius: borderRadius, borderWidth: 1, padding: 16, gap: 2, marginTop: 8 },
    confirmBtn: {
      width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, borderRadius: borderRadius, paddingVertical: 15, marginTop: 8,
    },
    confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    confirmBtnOutline: {
      width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, borderRadius: borderRadius, borderWidth: 1.5, paddingVertical: 13,
    },
    confirmBtnOutlineText: { fontSize: 15, fontWeight: '700' },
    bottomBar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1,
    },
    priceWrap: { gap: 2 },
    priceLabel: { fontSize: 11 },
    priceValue: { fontSize: 22, fontWeight: '900' },
    ctaBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      borderRadius: borderRadius, paddingHorizontal: 24, paddingVertical: 14,
    },
    ctaBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  });
