
import { ProgramDay, MasterExercise, RestCategory, SetType, EducationSection, ExerciseInfoCard } from './types.ts';

export const EXERCISE_INFO_CARDS: Record<string, ExerciseInfoCard> = {
  'lateral_raises_db': {
    name: 'Ridicari laterale cu gantere',
    whyExercise: 'Izolare pura a deltoidului lateral fara implicarea tricepsului. Pre-oboseste umerii pentru presa.',
    whySets: 'Ramp pt. activare; Top pt. tensiune maxima; Back-off pt. volum metabolic.',
    executionCues: ['Ridica coatele, nu palmele', 'Imagineaza-ti ca torni apa dintr-o carafa', 'Control 2 sec pe coborare'],
    recommendedRest: { time: '01:30', label: 'Isolation / Metabolic' }
  },
};

export const MASTER_EXERCISE_LIST: MasterExercise[] = [
  // --- PIEPT ---
  { id: 'ex_p1', name: 'Barbell Bench Press', muscleGroup: 'Piept', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_p2', name: 'Incline Barbell Press', muscleGroup: 'Piept', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_p3', name: 'Incline Dumbbell Press', muscleGroup: 'Piept', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_p4', name: 'Flat Dumbbell Press', muscleGroup: 'Piept', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_p5', name: 'Machine Chest Press (convergent)', muscleGroup: 'Piept', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_p6', name: 'Smith Machine Incline Press', muscleGroup: 'Piept', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_p7', name: 'Cable Chest Press', muscleGroup: 'Piept', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_p8', name: 'Cable Fly (low-to-high)', muscleGroup: 'Piept', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_p9', name: 'Cable Fly (mid-range)', muscleGroup: 'Piept', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_p10', name: 'Cable Fly (high-to-low)', muscleGroup: 'Piept', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_p11', name: 'Pec Deck', muscleGroup: 'Piept', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_p12', name: 'Dumbbell Fly pe banca inclinata', muscleGroup: 'Piept', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_p13', name: 'Decline Bench Press', muscleGroup: 'Piept', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_p14', name: 'Plate Loaded Chest Press', muscleGroup: 'Piept', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_p15', name: 'Flotari (weighted)', muscleGroup: 'Piept', restCategory: 'isolation', movementType: 'compound' },

  // --- SPATE ---
  { id: 'ex_s1', name: 'Tractiuni priza neutra', muscleGroup: 'Spate', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_s2', name: 'Tractiuni pronate', muscleGroup: 'Spate', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_s3', name: 'Tractiuni asistate', muscleGroup: 'Spate', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_s4', name: 'Lat Pulldown priza larga', muscleGroup: 'Spate', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_s5', name: 'Lat Pulldown priza neutra', muscleGroup: 'Spate', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_s5_1', name: 'Underhand Lat Pulldown', muscleGroup: 'Spate', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_s6', name: 'Single Arm Cable Lat Pulldown', muscleGroup: 'Spate', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_s7', name: 'Straight Arm Pulldown', muscleGroup: 'Spate', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_s8', name: 'Chest Supported Row', muscleGroup: 'Spate', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_s9', name: 'Ramat la aparat (convergent)', muscleGroup: 'Spate', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_s10', name: 'Seated Cable Row', muscleGroup: 'Spate', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_s10_1', name: 'Wide Grip Seated Row', muscleGroup: 'Spate', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_s11', name: 'Barbell Row', muscleGroup: 'Spate', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_s12', name: 'Seal Row', muscleGroup: 'Spate', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_s13', name: 'Meadows Row', muscleGroup: 'Spate', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_s14', name: 'T-Bar Row', muscleGroup: 'Spate', restCategory: 'compound_barbell', movementType: 'compound' },

  // --- UMERI ---
  { id: 'ex_u1', name: 'Seated Dumbbell Shoulder Press', muscleGroup: 'Umeri', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_u2', name: 'Machine Shoulder Press', muscleGroup: 'Umeri', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_u3', name: 'Smith Machine Overhead Press', muscleGroup: 'Umeri', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_u3_1', name: 'Arnold Press', muscleGroup: 'Umeri', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_u4', name: 'Dumbbell Lateral Raise', muscleGroup: 'Umeri', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_u5', name: 'Cable Lateral Raise unilateral', muscleGroup: 'Umeri', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_u6', name: 'Machine Lateral Raise', muscleGroup: 'Umeri', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_u7', name: 'Leaning Cable Lateral Raise', muscleGroup: 'Umeri', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_u8', name: 'Reverse Pec Deck', muscleGroup: 'Umeri', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_u9', name: 'Cable Rear Delt Fly', muscleGroup: 'Umeri', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_u10', name: 'Chest Supported Rear Delt Raise', muscleGroup: 'Umeri', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_u11', name: 'Face Pull', muscleGroup: 'Umeri', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_u12', name: 'Upright Row (bara)', muscleGroup: 'Umeri', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_u13', name: 'Upright Row (cablu)', muscleGroup: 'Umeri', restCategory: 'isolation', movementType: 'isolation' },

  // --- BICEPS ---
  { id: 'ex_b1', name: 'Incline Dumbbell Curl', muscleGroup: 'Biceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_b2', name: 'Bayesian Cable Curl', muscleGroup: 'Biceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_b3', name: 'Preacher Curl (EZ sau aparat)', muscleGroup: 'Biceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_b4', name: 'Spider Curl', muscleGroup: 'Biceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_b5', name: 'EZ Bar Curl', muscleGroup: 'Biceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_b6', name: 'Cable Curl', muscleGroup: 'Biceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_b7', name: 'Hammer Curl', muscleGroup: 'Biceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_b8', name: 'Cross Body Hammer Curl', muscleGroup: 'Biceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_b9', name: 'Concentration Curl', muscleGroup: 'Biceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_b10', name: 'Drag Curl', muscleGroup: 'Biceps', restCategory: 'isolation', movementType: 'isolation' },

  // --- TRICEPS ---
  { id: 'ex_t1', name: 'Close Grip Bench Press', muscleGroup: 'Triceps', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_t2', name: 'Smith Close Grip Press', muscleGroup: 'Triceps', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_t3', name: 'Skull Crushers', muscleGroup: 'Triceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_t4', name: 'Overhead Cable Triceps Extension', muscleGroup: 'Triceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_t5', name: 'Single Arm Overhead Cable Extension', muscleGroup: 'Triceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_t6', name: 'Rope Pushdown', muscleGroup: 'Triceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_t7', name: 'Straight Bar Pushdown', muscleGroup: 'Triceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_t8', name: 'Bench Dips', muscleGroup: 'Triceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_t9', name: 'JM Press', muscleGroup: 'Triceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_t10', name: 'Dips la paralele', muscleGroup: 'Triceps', restCategory: 'compound_machine', movementType: 'compound' },

  // --- CVADRICEPSI ---
  { id: 'ex_q1', name: 'High Bar Back Squat', muscleGroup: 'Cvadriceps', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_q2', name: 'Front Squat', muscleGroup: 'Cvadriceps', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_q3', name: 'Hack Squat', muscleGroup: 'Cvadriceps', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_q4', name: 'Smith Machine Squat', muscleGroup: 'Cvadriceps', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_q5', name: 'Leg Press (picioare jos)', muscleGroup: 'Cvadriceps', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_q6', name: 'Bulgarian Split Squat', muscleGroup: 'Cvadriceps', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_q7', name: 'Reverse Lunge', muscleGroup: 'Cvadriceps', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_q8', name: 'Step-up', muscleGroup: 'Cvadriceps', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_q9', name: 'Leg Extension', muscleGroup: 'Cvadriceps', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_q10', name: 'Sissy Squat', muscleGroup: 'Cvadriceps', restCategory: 'isolation', movementType: 'isolation' },

  // --- FEMURALI ---
  { id: 'ex_f1', name: 'Romanian Deadlift', muscleGroup: 'Femurali', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_f2', name: 'Stiff Leg Deadlift', muscleGroup: 'Femurali', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_f3', name: 'Single Leg Romanian Deadlift', muscleGroup: 'Femurali', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_f4', name: 'Seated Leg Curl', muscleGroup: 'Femurali', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_f5', name: 'Lying Leg Curl', muscleGroup: 'Femurali', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_f6', name: 'Nordic Curl', muscleGroup: 'Femurali', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_f7', name: 'Cable Pull-through', muscleGroup: 'Femurali', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_f8', name: 'Good Morning', muscleGroup: 'Femurali', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_f9', name: 'Glute Ham Raise', muscleGroup: 'Femurali', restCategory: 'isolation', movementType: 'isolation' },

  // --- GLUTEI ---
  { id: 'ex_g1', name: 'Barbell Hip Thrust', muscleGroup: 'Glutei', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_g2', name: 'Smith Machine Hip Thrust', muscleGroup: 'Glutei', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_g3', name: 'Bulgarian Split Squat (inclinare trunchi)', muscleGroup: 'Glutei', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_g4', name: 'Reverse Lunge (Glute Bias)', muscleGroup: 'Glutei', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_g5', name: 'Cable Kickback', muscleGroup: 'Glutei', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_g6', name: '45 Back Extension (glute bias)', muscleGroup: 'Glutei', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_g7', name: 'Step-up inalt', muscleGroup: 'Glutei', restCategory: 'compound_machine', movementType: 'compound' },
  { id: 'ex_g8', name: 'Deficit Romanian Deadlift', muscleGroup: 'Glutei', restCategory: 'compound_barbell', movementType: 'compound' },
  { id: 'ex_g9', name: 'Frog Pumps', muscleGroup: 'Glutei', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_g10', name: 'Banded Hip Thrust', muscleGroup: 'Glutei', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_g11', name: 'Curtsy Lunge', muscleGroup: 'Glutei', restCategory: 'compound_machine', movementType: 'compound' },

  // --- ADDUCTORI / ABDUCTORI ---
  { id: 'ex_aa1', name: 'Hip Abduction Machine', muscleGroup: 'Adductori / Abductori', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_aa2', name: 'Hip Adduction Machine', muscleGroup: 'Adductori / Abductori', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_aa3', name: 'Cable Hip Abduction', muscleGroup: 'Adductori / Abductori', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_aa4', name: 'Cable Hip Adduction', muscleGroup: 'Adductori / Abductori', restCategory: 'isolation', movementType: 'isolation' },

  // --- LOWER BACK ---
  { id: 'ex_lb1', name: 'Back Extension 45', muscleGroup: 'Lower Back', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_lb2', name: 'Reverse Hyperextension', muscleGroup: 'Lower Back', restCategory: 'isolation', movementType: 'isolation' },

  // --- GAMBE ---
  { id: 'ex_ga1', name: 'Standing Calf Raise', muscleGroup: 'Gambe', restCategory: 'calves', movementType: 'isolation' },
  { id: 'ex_ga2', name: 'Seated Calf Raise', muscleGroup: 'Gambe', restCategory: 'calves', movementType: 'isolation' },
  { id: 'ex_ga3', name: 'Leg Press Calf Raise', muscleGroup: 'Gambe', restCategory: 'calves', movementType: 'isolation' },
  { id: 'ex_ga4', name: 'Single Leg Calf Raise', muscleGroup: 'Gambe', restCategory: 'calves', movementType: 'isolation' },
  { id: 'ex_ga5', name: 'Donkey Calf Raise', muscleGroup: 'Gambe', restCategory: 'calves', movementType: 'isolation' },
  { id: 'ex_ga6', name: 'Smith Machine Calf Raise', muscleGroup: 'Gambe', restCategory: 'calves', movementType: 'isolation' },
  { id: 'ex_ga7', name: 'Tibialis Raise', muscleGroup: 'Gambe', restCategory: 'calves', movementType: 'isolation' },

  // --- CORE ---
  { id: 'ex_c1', name: 'Hanging Leg Raise', muscleGroup: 'Core', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_c2', name: 'Captain Chair Leg Raise', muscleGroup: 'Core', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_c3', name: 'Cable Crunch', muscleGroup: 'Core', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_c4', name: 'Machine Crunch', muscleGroup: 'Core', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_c5', name: 'Ab Wheel Rollout', muscleGroup: 'Core', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_c6', name: 'Plank', muscleGroup: 'Core', restCategory: 'isolation', movementType: 'isolation' },
  { id: 'ex_c7', name: 'Plank cu greutate', muscleGroup: 'Core', restCategory: 'isolation', movementType: 'isolation' }
];

export const EDUCATION_CONTENT: EducationSection[] = [
  // --- A) TEHNICI DE ANTRENAMENT ---
  {
    id: 'edu_1', title: '1) Ramp-up', category: 'STRUCTURE', type: 'list',
    content: [
      'Seturile de Ramp-up nu sunt seturi de lucru si nu trebuie sa genereze oboseala sistemica.',
      'Scopul lor este lubrifierea articulatiilor, pregatirea neurologica si gasirea ritmului de executie.',
      'Foloseste incremente progresive (ex: 50%, 70%, 90% din greutatea de lucru) pentru putine repetari.',
      'Nu atinge niciodata esecul in timpul ramp-up-ului; vrei sa ramai "fresh" pentru setul TOP.'
    ]
  },
  {
    id: 'edu_2', title: '2) Top Set', category: 'EFFORT', type: 'list',
    content: [
      'Top Set-ul este cel mai important set al antrenamentului tau, unde intensitatea este maxima.',
      'Aici cauti sa bati recordul personal (greutate sau repetari) fata de saptamana trecuta.',
      'Efortul trebuie sa fie la RIR 0 sau 1 (maxim 1 repetare ramasa in rezerva).',
      'Concentrarea mentala trebuie sa fie absoluta; acest set dicteaza progresia pe termen lung.'
    ]
  },
  {
    id: 'edu_3', title: '3) Back-off', category: 'STRUCTURE', type: 'list',
    content: [
      'Seturile de Back-off vin dupa Top Set pentru a acumula volumul necesar hipertrofiei.',
      'Scade greutatea cu aproximativ 10-15% fata de Top Set pentru a ramane in rep-range-ul tinta.',
      'Focusul se muta de pe forta pura pe controlul perfect al miscarii si conexiunea minte-mușchi.',
      'Chiar daca greutatea e mai mica, efortul trebuie sa ramana ridicat (RIR 1-2).'
    ]
  },

  // --- B) MASURAREA EFORTULUI ---
  {
    id: 'edu_4', title: '4) Ce este RIR?', category: 'EFFORT', type: 'list',
    content: [
      'RIR inseamna "Reps In Reserve" (Repetari in Rezerva) si masoara proximitatea fata de esec.',
      'RIR 0 inseamna ca nu mai puteai face nicio repetare corecta.',
      'RIR 1 inseamna ca mai aveai "una in rezervor".',
      'Este o unitate de masura a intensitatii relative, esentiala pentru autoreglare.'
    ]
  },
  {
    id: 'edu_5', title: '5) Interpretarea corecta a RIR', category: 'EFFORT', type: 'list',
    content: [
      'Majoritatea incepatorilor subestimeaza efortul; ce cred ei ca e RIR 0 este de multe ori RIR 3.',
      'Pentru hipertrofie, majoritatea seturilor trebuie sa fie intre RIR 0 si RIR 2.',
      'Daca inchei un set simtind ca mai puteai face 5 repetari, stimulul de crestere este minim.',
      'Invata sa recunosti incetinirea involuntara a vitezei barei - acesta este indicatorul real al proximitatii de esec.'
    ]
  },
  {
    id: 'edu_6', title: '6) Esec tehnic vs esec total', category: 'EFFORT', type: 'list',
    content: [
      'Esecul tehnic apare cand nu mai poti face o repetare cu forma perfecta de executie.',
      'Esecul total (muscular) apare cand muschiul nu mai poate misca greutatea deloc.',
      'In RDZ, ne oprim la esecul tehnic pentru a minimiza riscul de accidentare.',
      'Trișatul (folosirea balansului) la finalul setului este permis doar de avansati pe anumite exercitii de izolare.'
    ]
  },

  // --- C) CLARIFICARI CRITICE ---
  {
    id: 'edu_7', title: '7) De ce nu toate exercitiile au Top Set?', category: 'CLARITY', type: 'list',
    content: [
      'Exercitiile compuse grele (Squat, RDL, Press) beneficiaza cel mai mult de structura Top Set.',
      'La exercitiile de izolare mica (Face Pull, Lateral Raises), acumularea de volum e mai importanta decat forta maxima.',
      'Top Set-ul pe exercitii cu stabilitate mica poate duce la degradarea formei prea rapid.',
      'Urmeaza recomandarile aplicatiei pentru fiecare miscare in parte.'
    ]
  },
  {
    id: 'edu_8', title: '8) Set efectiv vs set logat', category: 'CLARITY', type: 'list',
    content: [
      'Un set logat devine "efectiv" doar daca intensitatea (RIR) a fost suficient de mare.',
      'Nu loga seturile de incalzire ca seturi de lucru (Working Sets).',
      'In tabul Progress, urmarim doar seturile care au contat cu adevarat pentru stimul.',
      'Calitatea executiei primeaza in fata numarului de seturi trecute in agenda.'
    ]
  },
  {
    id: 'edu_9', title: '9) Pomparea nu este criteriu de progres', category: 'CLARITY', type: 'list',
    content: [
      'Senzatia de "pompare" (sangele in muschi) este placuta, dar nu garanteaza cresterea.',
      'Poti fi foarte pompat dupa un set de 50 de repetari usoare, fara sa stimulezi fibrele rapide.',
      'Cauta progresia tensiunii mecanice (mai multe kg/reps) ca indicator principal.',
      'Pomparea este un indicator secundar al conexiunii minte-muschi, nu obiectivul final.'
    ]
  },
  {
    id: 'edu_10', title: '10) De ce nu urmarim volumul total ca obiectiv', category: 'CLARITY', type: 'list',
    content: [
      'Mai mult nu inseamna mai bine; inseamna doar mai mult.',
      'Volumul excesiv (Junk Volume) consuma resurse de recuperare fara a oferi stimul suplimentar.',
      'Daca faci 20 de seturi de piept intr-o zi, probabil ultimele 10 sunt de calitate slaba.',
      'Obiectivul este sa facem volumul minim necesar pentru a genera progresie maxima.'
    ]
  },

  // --- D) STRUCTURA PROGRAMULUI ---
  {
    id: 'edu_11', title: '11) Volum & frecventa', category: 'STRUCTURE', type: 'list',
    content: [
      'Frecventa optima pentru majoritatea oamenilor este antrenarea unei grupe de 2 ori pe saptamana.',
      'Aceasta permite distribuirea volumului saptamanal in sesiuni mai scurte si intense.',
      'Repausul intre sesiuni este momentul in care muschiul se repara si creste.',
      'RDZ echilibreaza aceste variabile pentru a preveni supraantrenamentul.'
    ]
  },
  {
    id: 'edu_12', title: '12) Volum suficient, nu maxim', category: 'STRUCTURE', type: 'list',
    content: [
      'Exista un "punct dulce" al volumului (MEV - Minimum Effective Volume).',
      'Depasirea capacitatii de recuperare (MRV) duce la stagnare sau accidentari.',
      'Daca nu poti progresa de la o saptamana la alta, probabil faci prea mult sau nu mananci destul.',
      'Invata sa ai rabdare; hipertrofia este un maraton, nu un sprint.'
    ]
  },

  // --- E) AUTOREGLARE & RECUPERARE ---
  {
    id: 'edu_13', title: '13) Autoreglare', category: 'RECOVERY', type: 'list',
    content: [
      'Performanta in sala variaza zilnic in functie de somn, stres si nutritie.',
      'Autoreglarea inseamna sa ajustezi greutatea zilei in functie de cum te simti la Ramp-up.',
      'Daca 100kg se simt astazi ca 120kg, scade greutatea si mentine intensitatea (RIR).',
      'Nu forta un record personal daca organismul iti trimite semnale de oboseala extrema.'
    ]
  },
  {
    id: 'edu_14', title: '14) Deload', category: 'RECOVERY', type: 'list',
    content: [
      'Deload-ul este o saptamana de recuperare activa, nu o saptamana de stat pe canapea.',
      'Scadem volumul (numarul de seturi) la jumatate si intensitatea cu 10-20%.',
      'Permite articulatiilor si sistemului nervos central sa se refaca complet.',
      'Dupa un deload corect, vei reveni in sala mult mai puternic.'
    ]
  },
  {
    id: 'edu_15', title: '15) Deload – cand si de ce', category: 'RECOVERY', type: 'list',
    content: [
      'Semne ca ai nevoie de deload: scaderea fortei, lipsa apetitului, somn agitat, dureri articulare.',
      'In general, un deload este necesar la fiecare 5-8 saptamani de antrenament intens.',
      'Nu astepta sa te accidentezi pentru a lua o pauza.',
      'Planifica deload-ul preventiv pentru a mentine progresia pe termen lung.'
    ]
  },

  // --- F) INDIVIDUALIZARE & AVANSATI ---
  {
    id: 'edu_16', title: '16) Individualizarea raspunsului', category: 'ADVANCED', type: 'list',
    content: [
      'Nu toti reactionam la fel la acelasi numar de seturi sau exercitii.',
      'Genetica, varsta si istoricul sportiv dicteaza capacitatea de munca.',
      'Foloseste functia de Custom Workout pentru a adauga volum unde simti ca ramai in urma.',
      'Asculta-ti corpul: daca o grupa creste bine cu volum mic, nu o forta inutil.'
    ]
  },
  {
    id: 'edu_17', title: '17) Ce faci cand nu progresezi', category: 'ADVANCED', type: 'list',
    content: [
      'Pasul 1: Verifica somnul (minim 7-8h) si aportul de proteine.',
      'Pasul 2: Verifica tehnica de executie; poate "furi" repetarile.',
      'Pasul 3: Redu volumul sau schimba exercitiul daca ai atins un platou psihologic.',
      'Stagnarea este deseori un semnal de acumulare a oboselii, nu de lipsa a efortului.'
    ]
  },
  {
    id: 'edu_18', title: '18) Progresul nu este liniar', category: 'ADVANCED', type: 'list',
    content: [
      'Nu vei putea adauga kg pe bara in fiecare saptamana la infinit.',
      'Uneori progresia inseamna aceeasi greutate dar cu o tehnica mai curata.',
      'Alteori inseamna ca ai facut 8 repetari in loc de 7 cu aceeasi greutate.',
      'Accepta saptamanile de stagnare ca pe o parte fireasca a procesului biologic.'
    ]
  },

  // --- G) FILOSOFIA APLICATIEI ---
  {
    id: 'edu_19', title: '19) Filosofia aplicatiei', category: 'PHILOSOPHY', type: 'list',
    content: [
      'Trained by RDZ nu este doar un log de antrenament, ci un sistem de gandire.',
      'Eliminam tot ce este inutil (fluff) si ne concentram pe efortul care produce rezultate.',
      'Datele nu mint: foloseste graficele pentru a lua decizii obiective, nu emotionale.',
      'Excelenta vine din repetarea fundamentelor cu o intensitate brutala, zi dupa zi.'
    ]
  }
];

export const TRAINING_PROGRAM: ProgramDay[] = [
  {
    id: 'rdz_day1_push',
    name: 'ZIUA 1 – PUSH',
    exercises: [
      { id: 'd1_e1', name: 'Dumbbell Lateral Raise', defaultRampUpSets: 2, defaultBackOffSets: 2, hasTopSet: true, targetReps: '12-15', targetRir: 1 },
      { id: 'd1_e2', name: 'Cable Lateral Raise unilateral', defaultRampUpSets: 0, defaultBackOffSets: 3, hasTopSet: false, targetReps: '15-25', targetRir: 1 },
      { id: 'd1_e3', name: 'Incline Barbell Press', defaultRampUpSets: 2, defaultBackOffSets: 2, hasTopSet: true, targetReps: '6-8', targetRir: 1 },
      { id: 'd1_e4', name: 'Barbell Bench Press', defaultRampUpSets: 0, defaultBackOffSets: 2, hasTopSet: false, targetReps: '6-10', targetRir: 2 },
      { id: 'd1_e5', name: 'Cable Fly (mid-range)', defaultRampUpSets: 0, defaultBackOffSets: 3, hasTopSet: false, targetReps: '12-20', targetRir: 1 },
      { id: 'd1_e6', name: 'Rope Pushdown', defaultRampUpSets: 0, defaultBackOffSets: 3, hasTopSet: false, targetReps: '8-12', targetRir: 1 },
      { id: 'd1_e7', name: 'Overhead Cable Triceps Extension', defaultRampUpSets: 0, defaultBackOffSets: 2, hasTopSet: false, targetReps: '10-15', targetRir: 1 }
    ]
  },
  {
    id: 'rdz_day2_lower_quads',
    name: 'ZIUA 2 – LOWER (QUADS)',
    exercises: [
      { id: 'd2_e1', name: 'High Bar Back Squat', defaultRampUpSets: 2, defaultBackOffSets: 2, hasTopSet: true, targetReps: '5-8', targetRir: 1 },
      { id: 'd2_e2', name: 'Bulgarian Split Squat', defaultRampUpSets: 0, defaultBackOffSets: 3, hasTopSet: false, targetReps: '8-12', targetRir: 1 },
      { id: 'd2_e3', name: 'Leg Extension', defaultRampUpSets: 0, defaultBackOffSets: 4, hasTopSet: false, targetReps: '12-20', targetRir: 1 },
      { id: 'd2_e4', name: 'Lying Leg Curl', defaultRampUpSets: 0, defaultBackOffSets: 2, hasTopSet: false, targetReps: '12-15', targetRir: 2 },
      { id: 'd2_e5', name: 'Hip Adduction Machine', defaultRampUpSets: 0, defaultBackOffSets: 3, hasTopSet: false, targetReps: '12-20', targetRir: 1 },
      { id: 'd2_e6', name: 'Standing Calf Raise', defaultRampUpSets: 0, defaultBackOffSets: 6, hasTopSet: false, targetReps: '10-15', targetRir: 1 }
    ]
  },
  {
    id: 'rdz_day3_pull',
    name: 'ZIUA 3 – PULL',
    exercises: [
      { id: 'd3_e1', name: 'Tractiuni pronate', defaultRampUpSets: 2, defaultBackOffSets: 2, hasTopSet: true, targetReps: '6-8', targetRir: 1 },
      { id: 'd3_e2', name: 'Barbell Row', defaultRampUpSets: 0, defaultBackOffSets: 3, hasTopSet: false, targetReps: '6-10', targetRir: 1 },
      { id: 'd3_e3', name: 'Seated Cable Row', defaultRampUpSets: 0, defaultBackOffSets: 3, hasTopSet: false, targetReps: '10-15', targetRir: 1 },
      { id: 'd3_e4', name: 'Reverse Pec Deck', defaultRampUpSets: 0, defaultBackOffSets: 4, hasTopSet: false, targetReps: '12-20', targetRir: 1 },
      { id: 'd3_e5', name: 'EZ Bar Curl', defaultRampUpSets: 0, defaultBackOffSets: 6, hasTopSet: false, targetReps: '8-12', targetRir: 1 },
      { id: 'd3_e6', name: 'Plate Loaded Chest Press', defaultRampUpSets: 0, defaultBackOffSets: 2, hasTopSet: false, targetReps: '12-15', targetRir: 3 }
    ]
  },
  {
    id: 'rdz_day4_lower_fem_glute',
    name: 'ZIUA 4 – LOWER (FEMURAL + GLUTEI)',
    exercises: [
      { id: 'd4_e1', name: 'Romanian Deadlift', defaultRampUpSets: 2, defaultBackOffSets: 2, hasTopSet: true, targetReps: '6-8', targetRir: 2 },
      { id: 'd4_e2', name: 'Seated Leg Curl', defaultRampUpSets: 0, defaultBackOffSets: 3, hasTopSet: false, targetReps: '10-15', targetRir: 1 },
      { id: 'd4_e3', name: 'Lying Leg Curl', defaultRampUpSets: 0, defaultBackOffSets: 2, hasTopSet: false, targetReps: '12-20', targetRir: 1 },
      { id: 'd4_e4', name: 'Barbell Hip Thrust', defaultRampUpSets: 0, defaultBackOffSets: 3, hasTopSet: false, targetReps: '8-12', targetRir: 1 },
      { id: 'd4_e5', name: 'Cable Kickback', defaultRampUpSets: 0, defaultBackOffSets: 2, hasTopSet: false, targetReps: '10-15', targetRir: 1 },
      { id: 'd4_e6', name: 'Hack Squat', defaultRampUpSets: 0, defaultBackOffSets: 4, hasTopSet: false, targetReps: '10-15', targetRir: 1 },
      { id: 'd4_e7', name: 'Back Extension 45', defaultRampUpSets: 0, defaultBackOffSets: 3, hasTopSet: false, targetReps: '10-15', targetRir: 1 },
      { id: 'd4_e8', name: 'Standing Calf Raise', defaultRampUpSets: 0, defaultBackOffSets: 4, hasTopSet: false, targetReps: '10-15', targetRir: 1 }
    ]
  },
  {
    id: 'rdz_day5_arms_shoulders',
    name: 'ZIUA 5 – BRATE + UMERI',
    exercises: [
      { id: 'd5_e1', name: 'Cable Lateral Raise unilateral', defaultRampUpSets: 2, defaultBackOffSets: 2, hasTopSet: true, targetReps: '12-15', targetRir: 1 },
      { id: 'd5_e2', name: 'Dumbbell Lateral Raise', defaultRampUpSets: 0, defaultBackOffSets: 4, hasTopSet: false, targetReps: '15-25', targetRir: 1 },
      { id: 'd5_e3', name: 'Lat Pulldown priza larga', defaultRampUpSets: 0, defaultBackOffSets: 4, hasTopSet: false, targetReps: '10-12', targetRir: 1 },
      { id: 'd5_e4', name: 'EZ Bar Curl', defaultRampUpSets: 0, defaultBackOffSets: 4, hasTopSet: false, targetReps: '8-12', targetRir: 1 },
      { id: 'd5_e5', name: 'Rope Pushdown', defaultRampUpSets: 0, defaultBackOffSets: 4, hasTopSet: false, targetReps: '8-12', targetRir: 1 }
    ]
  }
];

export const getPresetRest = (category: RestCategory, type: SetType): number => {
  if (type === 'RAMP_UP') return 90;
  switch (category) {
    case 'compound_barbell': return 180;
    case 'compound_machine': return 120;
    case 'isolation': return 90;
    case 'calves': return 60;
    default: return 90;
  }
};
