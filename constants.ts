
import { ProgramDay, EducationalSection, MasterExercise } from './types';

export const TRAINING_PROGRAM: ProgramDay[] = [
  {
    id: 'day1',
    name: 'ZIUA 1: Umeri + Piept (Push)',
    exercises: [
      { id: 'd1_1', name: 'Ridicări laterale', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 2, targetReps: '10-15 Top / 15-25 Back', targetRir: 0 },
      { id: 'd1_2', name: 'Presă înclinată la aparat', defaultRampUpSets: 2, hasTopSet: true, defaultBackOffSets: 1, targetReps: '6-10 Top / 8-12 Back', targetRir: 0 },
      { id: 'd1_3', name: 'Bench Press (Volum)', defaultRampUpSets: 1, hasTopSet: false, defaultBackOffSets: 2, targetReps: '6-12', targetRir: 1 },
      { id: 'd1_4', name: 'Fluturări cablu (inferior)', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 3, targetReps: '12-25', targetRir: 1 },
      { id: 'd1_5', name: 'Triceps Pushdown', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 1, targetReps: '8-12 Top / 12-20 Back', targetRir: 0 },
      { id: 'd1_6', name: 'Overhead Extension', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '10-15', targetRir: 1 },
    ]
  },
  {
    id: 'day2',
    name: 'ZIUA 2: Picioare (Quads/Calves)',
    exercises: [
      { id: 'd2_1', name: 'Genuflexiuni (Variație)', defaultRampUpSets: 3, hasTopSet: true, defaultBackOffSets: 1, targetReps: '5-8 Top / 8-12 Back', targetRir: 0 },
      { id: 'd2_2', name: 'Fandări / Split Squat', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '8-15', targetRir: 1 },
      { id: 'd2_3', name: 'Extensii cvadriceps', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 2, targetReps: '10-15 Top / 15-25 Back', targetRir: 0 },
      { id: 'd2_4', name: 'Adductor Machine', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '12-20', targetRir: 2 },
      { id: 'd2_5', name: 'Standing Calf Raise', defaultRampUpSets: 1, hasTopSet: false, defaultBackOffSets: 3, targetReps: '10-20', targetRir: 1 },
      { id: 'd2_6', name: 'Seated Calf Raise', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 3, targetReps: '12-25', targetRir: 1 },
    ]
  },
  {
    id: 'day3',
    name: 'ZIUA 3: Spate + Biceps + Rear Delt',
    exercises: [
      { id: 'd3_1', name: 'Tracțiuni / Lat Pulldown', defaultRampUpSets: 2, hasTopSet: true, defaultBackOffSets: 1, targetReps: '6-10 Top / 8-12 Back', targetRir: 0 },
      { id: 'd3_2', name: 'Ramat (Bară/Aparat)', defaultRampUpSets: 2, hasTopSet: true, defaultBackOffSets: 1, targetReps: '6-8 Top / 8-12 Back', targetRir: 0 },
      { id: 'd3_3', name: 'Ramat Cablu', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '10-15', targetRir: 1 },
      { id: 'd3_4', name: 'Rear Delt Fly/Row', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 5, targetReps: '12-25', targetRir: 1 },
      { id: 'd3_5', name: 'Biceps Curl (Coate sprijinite)', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 1, targetReps: '8-12 Top / 12-20 Back', targetRir: 0 },
      { id: 'd3_6', name: 'Piept Ușor (Volum)', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '12-15', targetRir: 3 },
    ]
  },
  {
    id: 'day4',
    name: 'ZIUA 4: Picioare (Hams/Glutes)',
    exercises: [
      { id: 'd4_1', name: 'RDL (Îndreptări Românești)', defaultRampUpSets: 3, hasTopSet: true, defaultBackOffSets: 1, targetReps: '6-10 Top / 8-12 Back', targetRir: 1 },
      { id: 'd4_2', name: 'Seated Leg Curl', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 1, targetReps: '10-15 Top / 15-20 Back', targetRir: 0 },
      { id: 'd4_3', name: 'Bent-over Leg Curl', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '12-20', targetRir: 1 },
      { id: 'd4_4', name: 'Hip Thrust', defaultRampUpSets: 1, hasTopSet: false, defaultBackOffSets: 2, targetReps: '8-12', targetRir: 1 },
      { id: 'd4_5', name: 'Glute Isolation', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '10-15', targetRir: 1 },
      { id: 'd4_6', name: 'Back Extension / Reverse Hyper', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '10-15', targetRir: 2 },
      { id: 'd4_7', name: 'Standing Calf Raise', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 2, targetReps: '10-15 Top / 15-20 Back', targetRir: 1 },
    ]
  },
  {
    id: 'day5',
    name: 'ZIUA 5: Brațe + Umeri (Volum)',
    exercises: [
      { id: 'd5_1', name: 'Biceps Curl (Sprijinit)', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 1, targetReps: '8-12 Top / 12-20 Back', targetRir: 0 },
      { id: 'd5_2', name: 'Incline DB Curl', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '10-15', targetRir: 1 },
      { id: 'd5_3', name: 'Hammer Curl', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '8-12', targetRir: 1 },
      { id: 'd5_4', name: 'Triceps Pushdown', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 1, targetReps: '8-12 Top / 12-20 Back', targetRir: 0 },
      { id: 'd5_5', name: 'Overhead Extension', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '10-15', targetRir: 1 },
      { id: 'd5_6', name: 'Ridicări Laterale Cablu', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 3, targetReps: '15-25', targetRir: 1 },
    ]
  }
];

export const MASTER_EXERCISE_LIST: MasterExercise[] = [
    // PIEPT
    { id: 'chest_1', name: 'Bench Press (Bară)', muscleGroup: 'Piept' },
    { id: 'chest_2', name: 'Incline Bench Press (Bară)', muscleGroup: 'Piept' },
    { id: 'chest_3', name: 'Bench Press (Galtere)', muscleGroup: 'Piept' },
    { id: 'chest_4', name: 'Incline Press (Galtere)', muscleGroup: 'Piept' },
    { id: 'chest_5', name: 'Chest Press (Aparat)', muscleGroup: 'Piept' },
    { id: 'chest_6', name: 'Incline Machine Press', muscleGroup: 'Piept' },
    { id: 'chest_7', name: 'Fluturări Cablu (Crossover)', muscleGroup: 'Piept' },
    { id: 'chest_8', name: 'Pec Deck / Butterfly', muscleGroup: 'Piept' },
    { id: 'chest_9', name: 'Dips (Paralele)', muscleGroup: 'Piept' },
    { id: 'chest_10', name: 'Push-ups (Flotări)', muscleGroup: 'Piept' },

    // SPATE
    { id: 'back_1', name: 'Tracțiuni (Pull-ups)', muscleGroup: 'Spate' },
    { id: 'back_2', name: 'Lat Pulldown (Priză largă)', muscleGroup: 'Spate' },
    { id: 'back_3', name: 'Lat Pulldown (Priză neutră)', muscleGroup: 'Spate' },
    { id: 'back_4', name: 'Ramat cu Bara (Bent Over Row)', muscleGroup: 'Spate' },
    { id: 'back_5', name: 'Ramat cu Gantera', muscleGroup: 'Spate' },
    { id: 'back_6', name: 'Seated Cable Row', muscleGroup: 'Spate' },
    { id: 'back_7', name: 'T-Bar Row (Piept sprijinit)', muscleGroup: 'Spate' },
    { id: 'back_8', name: 'Pullover Cablu', muscleGroup: 'Spate' },
    { id: 'back_9', name: 'Single Arm Lat Pulldown', muscleGroup: 'Spate' },
    { id: 'back_10', name: 'Machine Row', muscleGroup: 'Spate' },

    // PICIOARE (Quads)
    { id: 'legs_1', name: 'Genuflexiuni (Squat)', muscleGroup: 'Picioare' },
    { id: 'legs_2', name: 'Front Squat', muscleGroup: 'Picioare' },
    { id: 'legs_3', name: 'Hack Squat', muscleGroup: 'Picioare' },
    { id: 'legs_4', name: 'Leg Press', muscleGroup: 'Picioare' },
    { id: 'legs_5', name: 'Extensii Cvadriceps', muscleGroup: 'Picioare' },
    { id: 'legs_6', name: 'Bulgarian Split Squat', muscleGroup: 'Picioare' },
    { id: 'legs_7', name: 'Fandări (Lunges)', muscleGroup: 'Picioare' },
    { id: 'legs_8', name: 'Sissy Squat', muscleGroup: 'Picioare' },

    // PICIOARE (Hams/Glutes)
    { id: 'hams_1', name: 'RDL (Îndreptări Românești)', muscleGroup: 'Picioare' },
    { id: 'hams_2', name: 'Seated Leg Curl', muscleGroup: 'Picioare' },
    { id: 'hams_3', name: 'Lying Leg Curl', muscleGroup: 'Picioare' },
    { id: 'hams_4', name: 'Hip Thrust', muscleGroup: 'Picioare' },
    { id: 'hams_5', name: 'Glute Bridge', muscleGroup: 'Picioare' },
    { id: 'hams_6', name: 'Kickback Cablu', muscleGroup: 'Picioare' },
    { id: 'hams_7', name: 'Hyperextensii (Back Ext)', muscleGroup: 'Picioare' },
    { id: 'hams_8', name: 'Sumo Deadlift', muscleGroup: 'Picioare' },

    // UMERI
    { id: 'delt_1', name: 'Military Press (Bară)', muscleGroup: 'Umeri' },
    { id: 'delt_2', name: 'Shoulder Press (Galtere)', muscleGroup: 'Umeri' },
    { id: 'delt_3', name: 'Machine Shoulder Press', muscleGroup: 'Umeri' },
    { id: 'delt_4', name: 'Ridicări Laterale (Galtere)', muscleGroup: 'Umeri' },
    { id: 'delt_5', name: 'Ridicări Laterale (Cablu)', muscleGroup: 'Umeri' },
    { id: 'delt_6', name: 'Ridicări Frontale', muscleGroup: 'Umeri' },
    { id: 'delt_7', name: 'Face Pull', muscleGroup: 'Umeri' },
    { id: 'delt_8', name: 'Reverse Pec Deck (Rear Delt)', muscleGroup: 'Umeri' },
    { id: 'delt_9', name: 'Rear Delt Fly (Galtere)', muscleGroup: 'Umeri' },
    { id: 'delt_10', name: 'Upright Row', muscleGroup: 'Umeri' },

    // BRATE
    { id: 'arm_1', name: 'Biceps Curl (Bară)', muscleGroup: 'Brațe' },
    { id: 'arm_2', name: 'Biceps Curl (Galtere)', muscleGroup: 'Brațe' },
    { id: 'arm_3', name: 'Hammer Curl', muscleGroup: 'Brațe' },
    { id: 'arm_4', name: 'Preacher Curl', muscleGroup: 'Brațe' },
    { id: 'arm_5', name: 'Bayesian Curl (Cablu)', muscleGroup: 'Brațe' },
    { id: 'arm_6', name: 'Triceps Pushdown (Coardă)', muscleGroup: 'Brațe' },
    { id: 'arm_7', name: 'Triceps Pushdown (Bară)', muscleGroup: 'Brațe' },
    { id: 'arm_8', name: 'Skullcrushers', muscleGroup: 'Brațe' },
    { id: 'arm_9', name: 'Overhead Extension (Ganteră)', muscleGroup: 'Brațe' },
    { id: 'arm_10', name: 'Dips (Bancă/Paralele)', muscleGroup: 'Brațe' },

    // ABS/CALVES/OTHER
    { id: 'other_1', name: 'Standing Calf Raise', muscleGroup: 'Altele' },
    { id: 'other_2', name: 'Seated Calf Raise', muscleGroup: 'Altele' },
    { id: 'other_3', name: 'Leg Raise (Abdomene)', muscleGroup: 'Altele' },
    { id: 'other_4', name: 'Crunch (Abdomene)', muscleGroup: 'Altele' },
    { id: 'other_5', name: 'Plank', muscleGroup: 'Altele' },
    { id: 'other_6', name: 'Shrugs (Trapez)', muscleGroup: 'Altele' },
];

export interface ExerciseContext {
  why: string;
  scheme: string;
  cue: string;
  rest: number; // Seconds
}

export const EXERCISE_CONTEXT: Record<string, ExerciseContext> = {
  // ZIUA 1
  'd1_1': { why: 'Izolare pură a deltoidului lateral fără implicarea tricepsului. Pre-obosește umerii pentru presă.', scheme: 'Un set "all-out" pentru activare maximă, urmat de back-off pentru volum metabolic.', cue: 'Ridică coatele, nu palmele. Imaginează-ți că torni apă dintr-o carafă.', rest: 90 },
  'd1_2': { why: 'Stabilitatea mașinii permite recrutarea maximă a pieptului superior (clavicular) în siguranță.', scheme: 'Top set greu pentru tensiune mecanică. Back-off pentru a epuiza fibrele rămase.', cue: 'Ține omoplații lipiți de spătar. Împinge coatele spre interior la vârf.', rest: 180 },
  'd1_3': { why: 'Mișcare compusă clasică pentru dezvoltarea generală a pieptului și a forței de împingere.', scheme: 'Volum moderat, nu eșec total, pentru a acumula oboseală fără risc major de accidentare.', cue: 'Controlează coborârea. Nu lăsa bara să cadă pe piept.', rest: 120 },
  'd1_4': { why: 'Întindere maximă a pectoralului sub tensiune constantă, imposibil de obținut cu gantere.', scheme: 'Reps multe pentru a pompa sânge în mușchi și a întinde fascia.', cue: 'Concentrază-te pe întindere, nu pe cât de mult apropii mânerele.', rest: 60 },
  'd1_5': { why: 'Izolare strictă a tricepsului, capul lateral și medial.', scheme: 'Top set greu pentru forță, back-off pentru volum.', cue: 'Ține coatele fixe lângă corp. Doar antebrațul se mișcă.', rest: 90 },
  'd1_6': { why: 'Lucrează capul lung al tricepsului prin poziția brațului deasupra capului.', scheme: 'Pompaj și întindere. Greutate moderată.', cue: 'Lasă greutatea să te întindă bine în spate.', rest: 60 },
  
  // ZIUA 2
  'd2_1': { why: 'Regele exercițiilor pentru picioare. Stimul sistemic masiv.', scheme: 'Ramp-up extensiv necesar. Top set-ul este brutal dar eficient.', cue: 'Genunchii merg peste vârfuri. Spatele drept.', rest: 180 },
  'd2_2': { why: 'Corectează asimetriile și lucrează stabilizatorii.', scheme: 'Reps mai multe, greutate moderată pentru a proteja genunchii.', cue: 'Lasă genunchiul din spate să atingă ușor solul.', rest: 90 },
  'd2_3': { why: 'Singurul exercițiu care lucrează rectus femoris în scurtare completă.', scheme: 'Seturi până la durere. Pompaj maxim.', cue: 'Extensie completă, pauză 1 secundă sus.', rest: 60 },
  'd2_4': { why: 'Adductorii mari contribuie masiv la dimensiunea coapsei.', scheme: 'Control strict, fără balans.', cue: 'Strânge genunchii cu forță.', rest: 60 },
  'd2_5': { why: 'Gastrocnemius lucrează doar cu genunchiul drept.', scheme: 'Pauză în partea de jos pentru a elimina reflexul de întindere.', cue: 'Ridică-te pe degetul mare.', rest: 60 },
  'd2_6': { why: 'Solearul lucrează cu genunchiul îndoit.', scheme: 'Reps multe, arsură maximă.', cue: 'Mișcare completă.', rest: 45 },

  // ZIUA 3
  'd3_1': { why: 'Lățimea spatelui. Tracțiunile recrutează fibrele verticale.', scheme: 'Top set greu. Dacă nu poți face tracțiuni, folosește Lat Pulldown.', cue: 'Trage cu coatele spre șolduri.', rest: 120 },
  'd3_2': { why: 'Grosimea spatelui. Ramatul permite greutăți mari.', scheme: 'Top set pentru forță.', cue: 'Ține pieptul sus.', rest: 120 },
  'd3_3': { why: 'Izolare și contracție de vârf.', scheme: 'Focus pe contracție.', cue: 'Strânge omoplații la final.', rest: 90 },
  'd3_4': { why: 'Deltoidul posterior este adesea neglijat dar esențial pentru aspectul 3D.', scheme: 'Volum foarte mare, greutate mică.', cue: 'Du mâinile în lateral și spate.', rest: 45 },
  'd3_5': { why: 'Preacher curl elimină balansul și izolează bicepsul.', scheme: 'Control total.', cue: 'Nu întinde complet brațul dacă simți disconfort.', rest: 90 },
  'd3_6': { why: 'Volum suplimentar pentru piept fără a obosi sistemul nervos.', scheme: 'Ușor și controlat.', cue: 'Focus pe mușchi, nu pe mișcare.', rest: 60 },

  // ZIUA 4
  'd4_1': { why: 'Lanțul posterior. Construiește femurali și fesieri puternici.', scheme: 'Greutate mare, reps puține.', cue: 'Împinge bazinul în spate. Genunchii ușor flexați.', rest: 180 },
  'd4_2': { why: 'Izolare femurali în poziție alungită.', scheme: 'Control pe negativ.', cue: 'Trage călcâiele sub scaun.', rest: 90 },
  'd4_3': { why: 'Variație pentru capul scurt al bicepsului femural.', scheme: 'Pompaj.', cue: 'Bazinul lipit de bancă.', rest: 60 },
  'd4_4': { why: 'Cel mai bun exercițiu pentru fesieri.', scheme: 'Greutate mare, extensie completă de șold.', cue: 'Privirea înainte, împinge din călcâie.', rest: 120 },
  'd4_5': { why: 'Finisher pentru fesieri.', scheme: 'Reps multe.', cue: 'Abducție controlată.', rest: 60 },
  'd4_6': { why: 'Decompresie și volum pentru zona lombară/fesieri.', scheme: 'Controlat.', cue: 'Nu hiperextinde spatele excesiv.', rest: 60 },
  'd4_7': { why: 'Volum pentru gambe.', scheme: 'Execuție strictă.', cue: 'Pauză jos.', rest: 60 },

  // ZIUA 5
  'd5_1': { why: 'Biceps strict.', scheme: 'Greutate moderată.', cue: 'Coatele în fața corpului.', rest: 90 },
  'd5_2': { why: 'Biceps din poziție alungită.', scheme: 'Întindere maximă.', cue: 'Lasă brațul să atârne complet.', rest: 60 },
  'd5_3': { why: 'Brahial și antebraț. Lățește brațul din față.', scheme: 'Prindere neutră.', cue: 'Strânge gantera tare.', rest: 60 },
  'd5_4': { why: 'Volum triceps.', scheme: 'Pompaj.', cue: 'Extensie completă.', rest: 60 },
  'd5_5': { why: 'Capul lung triceps.', scheme: 'Întindere.', cue: 'Coatele sus.', rest: 60 },
  'd5_6': { why: 'Finisher umeri.', scheme: 'Arsură metabolică.', cue: 'Coatele sus.', rest: 45 },
};

export const EDUCATION_CONTENT: EducationalSection[] = [
  // --- A) FOUNDATION ---
  { 
    id: 's1', 
    category: 'FOUNDATION', 
    title: '1) Ramp-up', 
    type: 'list', 
    content: [
        'Seturile de ramp-up au rolul exclusiv de pregătire neuromusculară.', 
        'Nu se execută până la eșec. RIR-ul trebuie să fie mare (>3).', 
        'Nu se contorizează în volumul de antrenament.', 
        'Scopul este de a ajunge la greutatea de lucru în siguranță.'
    ] 
  },
  { 
    id: 's2', 
    category: 'FOUNDATION', 
    title: '2) Top Set', 
    type: 'list', 
    content: [
        'Este cel mai important set al antrenamentului.',
        'Obiectiv: Performanță maximă cu tehnică perfectă.',
        'RIR țintă: 0-1 (foarte aproape de eșec sau eșec tehnic).',
        'Dacă progresezi la Top Set, progresezi în masă musculară.'
    ] 
  },
  { 
    id: 's3', 
    category: 'FOUNDATION', 
    title: '3) Back-off', 
    type: 'list', 
    content: [
        'Rol: Acumulare de volum suplimentar cu oboseală redusă.',
        'Greutatea se scade cu ~10-20% față de Top Set.',
        'Se execută tot aproape de eșec (RIR 0-1).',
        'Completează stimulul fără a distruge recuperarea.'
    ] 
  },

  // --- B) EFFORT ---
  { 
    id: 's4', 
    category: 'EFFORT', 
    title: '4) Ce este RIR?', 
    type: 'list', 
    content: [
        'RIR = Repetitions In Reserve (Repetări în Rezervă).',
        'RIR 0 = Nu mai poți face nicio repetare corectă.',
        'RIR 1 = Mai poți face exact 1 repetare corectă.',
        'RIR 2 = Mai poți face exact 2 repetări corecte.',
        'Hipertrofia optimă apare la RIR 0-3.'
    ] 
  },
  { 
    id: 's11', 
    category: 'EFFORT', 
    title: '11) Interpretarea corectă a RIR', 
    type: 'list', 
    content: [
        'Mulți oameni subestimează RIR-ul (cred că sunt la eșec, dar mai au 5 reps).',
        'Când mișcarea încetinește involuntar, te apropii de eșec.',
        'Adevăratul eșec înseamnă că viteza devine zero în ciuda efortului maxim.'
    ] 
  },
  { 
    id: 's14', 
    category: 'EFFORT', 
    title: '14) Eșec tehnic vs eșec total', 
    type: 'list', 
    content: [
        'Eșec tehnic = nu mai poți face o repetare CORECTĂ.',
        'Eșec total = nu mai poți mișca greutatea deloc.',
        'Programul folosește eșec tehnic (RIR 0).',
        'NU eșec total (care crește riscul de accidentare).'
    ] 
  },

  // --- C) CLARITY ---
  { 
    id: 's5', 
    category: 'CLARITY', 
    title: '5) De ce nu toate au Top Set?', 
    type: 'list', 
    content: [
        'Exercițiile de izolare (ex: fluturări, laterale) pot fi traumatizante articular cu greutăți mari.',
        'La acestea, prioritizăm "metabolic stress" și volumul.',
        'Nu este necesar un "Top Set" greu de 5-8 repetări la fiecare exercițiu.'
    ] 
  },
  { 
    id: 's13', 
    category: 'CLARITY', 
    title: '13) Set efectiv vs set logat', 
    type: 'list', 
    content: [
        'Un set logat ≠ automat un set eficient.',
        'Un set devine eficient doar dacă este suficient de aproape de eșec (RIR ≤3) și are execuție corectă.',
        'Ramp-up = logat, dar NU eficient.',
        'Back-off = eficient, dar secundar.',
        'Top set = eficient principal.'
    ] 
  },
  { 
    id: 's15', 
    category: 'CLARITY', 
    title: '15) Pomparea NU este criteriu de progres', 
    type: 'list', 
    content: [
        'Pomparea este un efect secundar al afluxului de sânge.',
        'Nu corelează direct cu hipertrofia pe termen lung.',
        'Progresul este evaluat prin performanța Top Set-ului și consistență în timp.'
    ] 
  },
  { 
    id: 's16', 
    category: 'CLARITY', 
    title: '16) De ce nu urmărim volumul total ca obiectiv', 
    type: 'list', 
    content: [
        'Volumul este o unealtă, nu un scop.',
        'Mai mult volum ≠ progres mai bun.',
        'Top Set-ul este criteriul principal.',
        'Volumul se ajustează în funcție de performanță.'
    ] 
  },

  // --- D) STRUCTURE ---
  { 
    id: 's6', 
    category: 'STRUCTURE', 
    title: '6) Volum & Frecvență', 
    type: 'list', 
    content: [
        'Frecvența optimă este de obicei 2x pe săptămână per grupă musculară.',
        'Volumul este moderat spre mic, dar intensitatea este maximă.',
        'Mai mult nu înseamnă mai bine. Mai bine înseamnă mai bine.'
    ] 
  },
  { 
    id: 's9', 
    category: 'STRUCTURE', 
    title: '9) Volum suficient, nu maxim', 
    type: 'list', 
    content: [
        'Nu căutăm volumul maxim recuperabil (MRV), ci volumul minim eficient care produce progres.',
        'Orice set peste necesar este doar oboseală inutilă (Junk Volume).',
        'Dacă progresezi la Top Set, volumul este suficient.'
    ] 
  },

  // --- E) RECOVERY ---
  { 
    id: 's7', 
    category: 'RECOVERY', 
    title: '7) Autoreglare', 
    type: 'list', 
    content: [
        'Ascultă-ți corpul. Dacă ești obosit, scade volumul (numărul de seturi de back-off).',
        'Dacă te simți puternic, atacă Top Set-ul cu încredere.',
        'Nu forța progresul dacă tehnica se degradează.'
    ] 
  },
  { 
    id: 's8', 
    category: 'RECOVERY', 
    title: '8) Deload', 
    type: 'list', 
    content: [
        'O săptămână ușoară pentru a permite recuperarea completă.',
        'Scade greutățile cu 50% sau volumul cu 50%.',
        'Fă un deload la fiecare 6-8 săptămâni sau când performanța stagnează/scade.'
    ] 
  },
  { 
    id: 's12', 
    category: 'RECOVERY', 
    title: '12) Deload – când și de ce', 
    type: 'list', 
    content: [
        'Semne că ai nevoie de Deload: insomnii, iritabilitate, dureri articulare, stagnare 2-3 sesiuni consecutive.',
        'Nu aștepta accidentarea. Planifică recuperarea.'
    ] 
  },

  // --- F) ADVANCED ---
  { 
    id: 's10', 
    category: 'ADVANCED', 
    title: '10) Individualizarea răspunsului', 
    type: 'list', 
    content: [
        'Unii sportivi tolerează mai mult volum, alții mai puțin.',
        'Dacă ești mereu dureros (DOMS excesiv), scade volumul.',
        'Dacă nu ai pompare și nu simți mușchiul, verifică execuția.'
    ] 
  },
  { 
    id: 's17', 
    category: 'ADVANCED', 
    title: '17) Ce faci când NU progresezi', 
    type: 'list', 
    content: [
        'Lipsa progresului pe termen scurt este normală.',
        'Nu se schimbă programul imediat. Nu se adaugă exerciții.',
        'Se analizează: oboseala, execuția, recuperarea.',
        'Progresul la avansați este lent, dar stabil.'
    ] 
  },
  { 
    id: 's18', 
    category: 'ADVANCED', 
    title: '18) Progresul nu este liniar', 
    type: 'list', 
    content: [
        'Vor exista săptămâni neutre și mici regresii.',
        'Important este trendul pe termen mediu.',
        'De aceea aplicația compară ultimele două Top Set-uri, nu fiecare sesiune izolată.'
    ] 
  },

  // --- G) PHILOSOPHY ---
  { 
    id: 's19', 
    category: 'PHILOSOPHY', 
    title: '19) Filosofia aplicației', 
    type: 'list', 
    content: [
        'Calitatea > cantitatea.',
        'Top Set-ul ghidează deciziile.',
        'Volumul susține, nu conduce.',
        'Recuperarea face parte din progres.',
        'Controlul rămâne la sportiv.'
    ] 
  }
];
