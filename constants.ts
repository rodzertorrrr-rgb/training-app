
import { ProgramDay, EducationalSection, MasterExercise } from './types';

export const TRAINING_PROGRAM: ProgramDay[] = [
  {
    id: 'day1',
    name: 'ZIUA 1: Umeri + Piept (Împins)',
    exercises: [
      { id: 'd1_1', name: 'Ridicări laterale la cablu/gantere', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 2, targetReps: '10-15 Top / 15-25 Back', targetRir: 0 },
      { id: 'd1_2', name: 'Împins înclinat la aparat (Chest Press)', defaultRampUpSets: 2, hasTopSet: true, defaultBackOffSets: 1, targetReps: '6-10 Top / 8-12 Back', targetRir: 0 },
      { id: 'd1_3', name: 'Împins din culcat cu bara (Orizontal)', defaultRampUpSets: 1, hasTopSet: false, defaultBackOffSets: 2, targetReps: '6-12', targetRir: 1 },
      { id: 'd1_4', name: 'Fluturări la cablu (Partea inferioară)', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 3, targetReps: '12-25', targetRir: 1 },
      { id: 'd1_5', name: 'Extensii triceps la helcometru', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 1, targetReps: '8-12 Top / 12-20 Back', targetRir: 0 },
      { id: 'd1_6', name: 'Extensii triceps deasupra capului', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '10-15', targetRir: 1 },
    ]
  },
  {
    id: 'day2',
    name: 'ZIUA 2: Picioare (Cvadriceps/Gambe)',
    exercises: [
      { id: 'd2_1', name: 'Genuflexiuni (Variație la alegere)', defaultRampUpSets: 3, hasTopSet: true, defaultBackOffSets: 1, targetReps: '5-8 Top / 8-12 Back', targetRir: 0 },
      { id: 'd2_2', name: 'Fandări sau Genuflexiuni bulgărești', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '8-15', targetRir: 1 },
      { id: 'd2_3', name: 'Extensii cvadriceps la aparat', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 2, targetReps: '10-15 Top / 15-25 Back', targetRir: 0 },
      { id: 'd2_4', name: 'Adducții la aparat', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '12-20', targetRir: 2 },
      { id: 'd2_5', name: 'Ridicări pe vârfuri din picioare', defaultRampUpSets: 1, hasTopSet: false, defaultBackOffSets: 3, targetReps: '10-20', targetRir: 1 },
      { id: 'd2_6', name: 'Ridicări pe vârfuri din șezut', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 3, targetReps: '12-25', targetRir: 1 },
    ]
  },
  {
    id: 'day3',
    name: 'ZIUA 3: Spate + Biceps + Deltoid Posterior',
    exercises: [
      { id: 'd3_1', name: 'Tracțiuni la bară sau helcometru', defaultRampUpSets: 2, hasTopSet: true, defaultBackOffSets: 1, targetReps: '6-10 Top / 8-12 Back', targetRir: 0 },
      { id: 'd3_2', name: 'Ramat cu bara sau la aparat', defaultRampUpSets: 2, hasTopSet: true, defaultBackOffSets: 1, targetReps: '6-8 Top / 8-12 Back', targetRir: 0 },
      { id: 'd3_3', name: 'Ramat la cablu din șezut', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '10-15', targetRir: 1 },
      { id: 'd3_4', name: 'Fluturări pentru deltoid posterior', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 5, targetReps: '12-25', targetRir: 1 },
      { id: 'd3_5', name: 'Flexii biceps la banca Scott', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 1, targetReps: '8-12 Top / 12-20 Back', targetRir: 0 },
      { id: 'd3_6', name: 'Împins pentru piept (Volum ușor)', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '12-15', targetRir: 3 },
    ]
  },
  {
    id: 'day4',
    name: 'ZIUA 4: Picioare (Femurali/Fesieri)',
    exercises: [
      { id: 'd4_1', name: 'Îndreptări românești (RDL)', defaultRampUpSets: 3, hasTopSet: true, defaultBackOffSets: 1, targetReps: '6-10 Top / 8-12 Back', targetRir: 1 },
      { id: 'd4_2', name: 'Flexii femurali din șezut', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 1, targetReps: '10-15 Top / 15-20 Back', targetRir: 0 },
      { id: 'd4_3', name: 'Flexii femurali din culcat', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '12-20', targetRir: 1 },
      { id: 'd4_4', name: 'Hip Thrust (Extensii șold)', defaultRampUpSets: 1, hasTopSet: false, defaultBackOffSets: 2, targetReps: '8-12', targetRir: 1 },
      { id: 'd4_5', name: 'Abducții fesieri', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '10-15', targetRir: 1 },
      { id: 'd4_6', name: 'Extensii lombare (Hiperextensii)', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '10-15', targetRir: 2 },
      { id: 'd4_7', name: 'Ridicări pe vârfuri din picioare', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 2, targetReps: '10-15 Top / 15-20 Back', targetRir: 1 },
    ]
  },
  {
    id: 'day5',
    name: 'ZIUA 5: Brațe + Umeri (Volum)',
    exercises: [
      { id: 'd5_1', name: 'Flexii biceps cu gantere/bara', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 1, targetReps: '8-12 Top / 12-20 Back', targetRir: 0 },
      { id: 'd5_2', name: 'Flexii biceps înclinat', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '10-15', targetRir: 1 },
      { id: 'd5_3', name: 'Flexii ciocan (Hammer Curls)', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '8-12', targetRir: 1 },
      { id: 'd5_4', name: 'Extensii triceps cu sfoara', defaultRampUpSets: 1, hasTopSet: true, defaultBackOffSets: 1, targetReps: '8-12 Top / 12-20 Back', targetRir: 0 },
      { id: 'd5_5', name: 'Extensii triceps deasupra capului', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 2, targetReps: '10-15', targetRir: 1 },
      { id: 'd5_6', name: 'Ridicări laterale la cablu', defaultRampUpSets: 0, hasTopSet: false, defaultBackOffSets: 3, targetReps: '15-25', targetRir: 1 },
    ]
  }
];

export const MASTER_EXERCISE_LIST: MasterExercise[] = [
    // PIEPT
    { id: 'chest_1', name: 'Împins cu bara din culcat', muscleGroup: 'Piept' },
    { id: 'chest_2', name: 'Împins înclinat cu bara', muscleGroup: 'Piept' },
    { id: 'chest_3', name: 'Împins cu gantere din culcat', muscleGroup: 'Piept' },
    { id: 'chest_4', name: 'Împins înclinat cu gantere', muscleGroup: 'Piept' },
    { id: 'chest_5', name: 'Împins la aparat (Chest Press)', muscleGroup: 'Piept' },
    { id: 'chest_6', name: 'Împins înclinat la aparat', muscleGroup: 'Piept' },
    { id: 'chest_7', name: 'Fluturări la cabluri (Crossover)', muscleGroup: 'Piept' },
    { id: 'chest_8', name: 'Fluturări la aparat (Pec Deck)', muscleGroup: 'Piept' },
    { id: 'chest_9', name: 'Flotări la paralele (Dips)', muscleGroup: 'Piept' },
    { id: 'chest_10', name: 'Flotări la sol', muscleGroup: 'Piept' },

    // SPATE
    { id: 'back_1', name: 'Tracțiuni la bară (Pull-ups)', muscleGroup: 'Spate' },
    { id: 'back_2', name: 'Tracțiuni la helcometru (Priză largă)', muscleGroup: 'Spate' },
    { id: 'back_3', name: 'Tracțiuni la helcometru (Priză neutră)', muscleGroup: 'Spate' },
    { id: 'back_4', name: 'Ramat cu bara (Bent Over Row)', muscleGroup: 'Spate' },
    { id: 'back_5', name: 'Ramat cu gantera pe braț', muscleGroup: 'Spate' },
    { id: 'back_6', name: 'Ramat la cablu din șezut', muscleGroup: 'Spate' },
    { id: 'back_7', name: 'Ramat T-Bar', muscleGroup: 'Spate' },
    { id: 'back_8', name: 'Pull-over la cablu', muscleGroup: 'Spate' },
    { id: 'back_9', name: 'Tracțiuni la helcometru pe un braț', muscleGroup: 'Spate' },
    { id: 'back_10', name: 'Ramat la aparat', muscleGroup: 'Spate' },

    // PICIOARE (Cvadriceps)
    { id: 'legs_1', name: 'Genuflexiuni cu bara (Back Squat)', muscleGroup: 'Picioare' },
    { id: 'legs_2', name: 'Genuflexiuni cu bara în față', muscleGroup: 'Picioare' },
    { id: 'legs_3', name: 'Hack Squat', muscleGroup: 'Picioare' },
    { id: 'legs_4', name: 'Presă pentru picioare (Leg Press)', muscleGroup: 'Picioare' },
    { id: 'legs_5', name: 'Extensii cvadriceps la aparat', muscleGroup: 'Picioare' },
    { id: 'legs_6', name: 'Genuflexiuni bulgărești', muscleGroup: 'Picioare' },
    { id: 'legs_7', name: 'Fandări (Lunges)', muscleGroup: 'Picioare' },
    { id: 'legs_8', name: 'Sissy Squat', muscleGroup: 'Picioare' },

    // PICIOARE (Femurali/Fesieri)
    { id: 'hams_1', name: 'Îndreptări românești (RDL)', muscleGroup: 'Picioare' },
    { id: 'hams_2', name: 'Flexii femurali din șezut', muscleGroup: 'Picioare' },
    { id: 'hams_3', name: 'Flexii femurali din culcat', muscleGroup: 'Picioare' },
    { id: 'hams_4', name: 'Hip Thrust', muscleGroup: 'Picioare' },
    { id: 'hams_5', name: 'Glute Bridge', muscleGroup: 'Picioare' },
    { id: 'hams_6', name: 'Kickback la cablu', muscleGroup: 'Picioare' },
    { id: 'hams_7', name: 'Extensii lombare (Hyperextensions)', muscleGroup: 'Picioare' },
    { id: 'hams_8', name: 'Îndreptări Sumo', muscleGroup: 'Picioare' },

    // UMERI
    { id: 'delt_1', name: 'Presă militară cu bara', muscleGroup: 'Umeri' },
    { id: 'delt_2', name: 'Împins cu gantere pentru umeri', muscleGroup: 'Umeri' },
    { id: 'delt_3', name: 'Împins la aparat pentru umeri', muscleGroup: 'Umeri' },
    { id: 'delt_4', name: 'Ridicări laterale cu gantere', muscleGroup: 'Umeri' },
    { id: 'delt_5', name: 'Ridicări laterale la cablu', muscleGroup: 'Umeri' },
    { id: 'delt_6', name: 'Ridicări frontale', muscleGroup: 'Umeri' },
    { id: 'delt_7', name: 'Face Pull', muscleGroup: 'Umeri' },
    { id: 'delt_8', name: 'Fluturări deltoid posterior la aparat', muscleGroup: 'Umeri' },
    { id: 'delt_9', name: 'Fluturări deltoid posterior cu gantere', muscleGroup: 'Umeri' },
    { id: 'delt_10', name: 'Ramat vertical (Upright Row)', muscleGroup: 'Umeri' },

    // BRAȚE
    { id: 'arm_1', name: 'Flexii biceps cu bara Z', muscleGroup: 'Brațe' },
    { id: 'arm_2', name: 'Flexii biceps cu gantere', muscleGroup: 'Brațe' },
    { id: 'arm_3', name: 'Flexii ciocan (Hammer Curls)', muscleGroup: 'Brațe' },
    { id: 'arm_4', name: 'Flexii la banca Scott', muscleGroup: 'Brațe' },
    { id: 'arm_5', name: 'Flexii Bayesian la cablu', muscleGroup: 'Brațe' },
    { id: 'arm_6', name: 'Extensii triceps la cablu (sfoară)', muscleGroup: 'Brațe' },
    { id: 'arm_7', name: 'Extensii triceps la cablu (bara)', muscleGroup: 'Brațe' },
    { id: 'arm_8', name: 'Skullcrushers (Extensii franceze)', muscleGroup: 'Brațe' },
    { id: 'arm_9', name: 'Extensii triceps cu gantera deasupra capului', muscleGroup: 'Brațe' },
    { id: 'arm_10', name: 'Flotări la paralele pentru triceps', muscleGroup: 'Brațe' },

    // ABDOMEN/GAMBE/ALTELE
    { id: 'other_1', name: 'Ridicări pe vârfuri din picioare', muscleGroup: 'Altele' },
    { id: 'other_2', name: 'Ridicări pe vârfuri din șezut', muscleGroup: 'Altele' },
    { id: 'other_3', name: 'Ridicări de picioare (Abdomen)', muscleGroup: 'Altele' },
    { id: 'other_4', name: 'Crunch la cablu/sol', muscleGroup: 'Altele' },
    { id: 'other_5', name: 'Plank (Planșă)', muscleGroup: 'Altele' },
    { id: 'other_6', name: 'Ridicări de umeri (Trapez)', muscleGroup: 'Altele' },
];

export interface ExerciseContext {
  why: string;
  scheme: string;
  cue: string;
  rest: number; // Seconds
}

export const EXERCISE_CONTEXT: Record<string, ExerciseContext> = {
  // ZIUA 1
  'd1_1': { why: 'Izolare pură a deltoidului lateral fără implicarea tricepsului. Pregătește articulația umărului.', scheme: 'Un set intens pentru activare, urmat de seturi de volum pentru stres metabolic.', cue: 'Ridică coatele, nu palmele. Imaginează-ți că torni apă dintr-o carafă.', rest: 90 },
  'd1_2': { why: 'Stabilitatea mașinii permite recrutarea maximă a pieptului superior în deplină siguranță.', scheme: 'Top set greu pentru tensiune mecanică. Back-off pentru a epuiza complet fibrele musculare.', cue: 'Ține omoplații lipiți de spătar. Împinge coatele spre interior la finalul mișcării.', rest: 180 },
  'd1_3': { why: 'Exercițiu compus de bază pentru dezvoltarea masei pectorale și a forței de împingere.', scheme: 'Volum moderat, evitând eșecul total pentru a acumula oboseală utilă fără risc de accidentare.', cue: 'Controlează coborârea. Nu lăsa bara să ricoșeze din piept.', rest: 120 },
  'd1_4': { why: 'Oferă o întindere maximă a pectoralului sub tensiune constantă, superioară ganterelor.', scheme: 'Repetări numeroase pentru a pompa sânge în mușchi și a întinde fascia musculară.', cue: 'Concentrează-te pe faza de întindere, nu pe cât de mult apropii mânerele.', rest: 60 },
  'd1_5': { why: 'Izolare strictă a tricepsului, vizând capetele lateral și medial.', scheme: 'Top set pentru forță, urmat de un set de volum pentru epuizare.', cue: 'Ține coatele fixe lângă corp. Doar antebrațul trebuie să se miște.', rest: 90 },
  'd1_6': { why: 'Vizează capul lung al tricepsului prin poziția brațului deasupra capului.', scheme: 'Pompaj și întindere profundă. Greutate moderată.', cue: 'Lasă greutatea să coboare controlat în spatele capului.', rest: 60 },
  
  // ZIUA 2
  'd2_1': { why: 'Exercițiul fundamental pentru picioare. Produce un stimul sistemic masiv.', scheme: 'Necesită mai multe seturi de încălzire (Ramp-up). Top set-ul este punctul culminant.', cue: 'Genunchii urmăresc direcția vârfurilor. Menține coloana neutră.', rest: 180 },
  'd2_2': { why: 'Corectează asimetriile musculare și lucrează mușchii stabilizatori.', scheme: 'Repetări mai multe, greutate moderată pentru protecția genunchilor.', cue: 'Coboară până când genunchiul din spate atinge aproape solul.', rest: 90 },
  'd2_3': { why: 'Singurul exercițiu care izolează cvadricepsul în poziție de scurtare completă.', scheme: 'Seturi până la eșec tehnic. Arsură musculară maximă.', cue: 'Extensie completă a picioarelor, pauză o secundă în punctul de vârf.', rest: 60 },
  'd2_4': { why: 'Adductorii contribuie semnificativ la volumul total al coapsei.', scheme: 'Control strict, fără mișcări bruște sau balans.', cue: 'Strânge genunchii controlat și menține tensiunea.', rest: 60 },
  'd2_5': { why: 'Gastrocnemius este activat optim cu genunchiul perfect întins.', scheme: 'Pauză în punctul de jos pentru a elimina forța elastică a tendonului lui Ahile.', cue: 'Împinge puternic de pe degetul mare.', rest: 60 },
  'd2_6': { why: 'Solearul este mușchiul principal vizat când genunchiul este flectat.', scheme: 'Repetări numeroase, arsură maximă.', cue: 'Mișcare completă pe toată raza de execuție.', rest: 45 },

  // ZIUA 3
  'd3_1': { why: 'Dezvoltă lățimea spatelui prin activarea fibrelor verticale ale dorsalilor.', scheme: 'Top set greu. Dacă nu poți face tracțiuni libere, folosește helcometrul.', cue: 'Imaginează-ți că tragi coatele spre buzunarele de la spate.', rest: 120 },
  'd3_2': { why: 'Dezvoltă grosimea spatelui. Permite manipularea unor greutăți mari.', scheme: 'Top set pentru tensiune mecanică brută.', cue: 'Menține pieptul sus și spatele drept.', rest: 120 },
  'd3_3': { why: 'Oferă o izolare excelentă și o contracție de vârf superioară.', scheme: 'Accent pe contracția musculară și control.', cue: 'Strânge omoplații puternic la finalul mișcării.', rest: 90 },
  'd3_4': { why: 'Deltoidul posterior oferă aspectul 3D umerilor și este adesea neglijat.', scheme: 'Volum mare, greutate relativ mică.', cue: 'Du brațele în lateral și în spate, nu doar în sus.', rest: 45 },
  'd3_5': { why: 'Elimină balansul și izolează bicepsul într-o poziție stabilă.', scheme: 'Control total pe faza negativă.', cue: 'Nu extinde complet brațul dacă simți tensiune neplăcută în tendon.', rest: 90 },
  'd3_6': { why: 'Volum suplimentar pentru piept fără a supraîncărca sistemul nervos.', scheme: 'Greutate mică, focus pe conexiunea minte-mușchi.', cue: 'Concentrează-te pe contracția pectoralului, nu pe mișcarea brațelor.', rest: 60 },

  // ZIUA 4
  'd4_1': { why: 'Vizează întreg lanțul posterior (femurali, fesieri, erectori spinali).', scheme: 'Greutate mare, repetări puține spre moderate.', cue: 'Împinge bazinul cât mai mult în spate. Păstrează bara aproape de picioare.', rest: 180 },
  'd4_2': { why: 'Izolare excelentă a femuralilor în poziție așezată.', scheme: 'Control strict pe faza de revenire (negativă).', cue: 'Trage călcâiele sub scaun cât mai mult.', rest: 90 },
  'd4_3': { why: 'Variație care pune accent pe capătul scurt al bicepsului femural.', scheme: 'Pompaj și densitate musculară.', cue: 'Menține bazinul lipit de bancă pe tot parcursul setului.', rest: 60 },
  'd4_4': { why: 'Recunoscut drept cel mai eficient exercițiu pentru dezvoltarea fesierilor.', scheme: 'Greutate mare, accent pe extensia completă a șoldului.', cue: 'Privirea înainte, împinge cu forță din călcâie.', rest: 120 },
  'd4_5': { why: 'Exercițiu de finisare pentru rotunjimea fesierilor.', scheme: 'Repetări multe pentru stres metabolic.', cue: 'Execuție controlată, fără grabă.', rest: 60 },
  'd4_6': { why: 'Decompresie și volum suplimentar pentru zona lombară și fesieri.', scheme: 'Controlat, fără mișcări bruște la final.', cue: 'Nu hiperextinde coloana excesiv în punctul de vârf.', rest: 60 },
  'd4_7': { why: 'Volum adițional pentru gambe.', scheme: 'Execuție strictă și controlată.', cue: 'Pauză în punctul de întindere maximă.', rest: 60 },

  // ZIUA 5
  'd5_1': { why: 'Exercițiu de bază pentru volumul bicepsului.', scheme: 'Greutate moderată, fără balans din trunchi.', cue: 'Ține coatele fixe pe lângă corp.', rest: 90 },
  'd5_2': { why: 'Pune bicepsul într-o poziție de întindere maximă (pre-stretch).', scheme: 'Accent pe faza excentrică (coborâre).', cue: 'Lasă brațele să atârne complet vertical în spate.', rest: 60 },
  'd5_3': { why: 'Lucrează brahialul și antebrațul, oferind lățime brațului.', scheme: 'Priză neutră (palmele față în față).', cue: 'Strânge gantera cu putere pentru activarea antebrațului.', rest: 60 },
  'd5_4': { why: 'Volum suplimentar pentru triceps.', scheme: 'Pompaj și arsură musculară.', cue: 'Extensie completă a brațului și depărtarea sforii la final.', rest: 60 },
  'd5_5': { why: 'Vizează capul lung al tricepsului printr-o întindere profundă.', scheme: 'Accent pe calitatea execuției.', cue: 'Ține coatele cât mai aproape de cap.', rest: 60 },
  'd5_6': { why: 'Finisare pentru umeri, vizând aspectul lat al acestora.', scheme: 'Epuizare metabolică.', cue: 'Condu mișcarea cu coatele, nu cu pumnii.', rest: 45 },
};

export const EDUCATION_CONTENT: EducationalSection[] = [
  // --- A) FUNDAMENTALE ---
  { 
    id: 's1', 
    category: 'FOUNDATION', 
    title: '1) Ramp-up (Încălzirea)', 
    type: 'list', 
    content: [
        'Seturile de ramp-up sunt folosite exclusiv pentru pregătirea sistemului nervos și a articulațiilor.', 
        'NU se execută până la eșec. Trebuie să simți greutatea, dar să nu obosești mușchiul.', 
        'Nu sunt contorizate în volumul total de lucru (seturi efective).', 
        'Scopul este să ajungi la greutatea de "Top Set" în siguranță deplină.'
    ] 
  },
  { 
    id: 's2', 
    category: 'FOUNDATION', 
    title: '2) Top Set (Setul Principal)', 
    type: 'list', 
    content: [
        'Este cel mai important set al întregului antrenament.',
        'Obiectiv: Performanță maximă cu o tehnică de execuție impecabilă.',
        'Intensitate țintă: RIR 0 sau 1 (eșec tehnic sau o repetare înainte).',
        'Dacă progresezi constant la Top Set (greutate sau repetări), vei construi masă musculară.'
    ] 
  },
  { 
    id: 's3', 
    category: 'FOUNDATION', 
    title: '3) Back-off (Setul de Volum)', 
    type: 'list', 
    content: [
        'Rol: Acumularea de volum suplimentar necesar hipertrofiei, cu o oboseală sistemică mai mică.',
        'Greutatea se reduce de obicei cu 10-20% față de Top Set.',
        'Se execută tot la intensitate mare (RIR 0-1).',
        'Completează stimulul oferit de Top Set fără a depăși capacitatea de recuperare.'
    ] 
  },

  // --- B) INTENSITATEA ---
  { 
    id: 's4', 
    category: 'EFFORT', 
    title: '4) Ce înseamnă RIR?', 
    type: 'list', 
    content: [
        'RIR = Repetitions In Reserve (Repetări în Rezervă).',
        'RIR 0 = Nu mai poți executa nicio repetare corectă suplimentară.',
        'RIR 1 = Te oprești simțind că ai mai fi putut face exact o repetare corectă.',
        'RIR 2 = Te oprești simțind că ai mai fi putut face exact două repetări corecte.',
        'Studiile arată că hipertrofia optimă are loc în zona RIR 0-3.'
    ] 
  },

  // --- E) RECUPERAREA ---
  { 
    id: 's8', 
    category: 'RECOVERY', 
    title: '8) Săptămâna de Deload', 
    type: 'list', 
    content: [
        'O perioadă de odihnă activă pentru a permite recuperarea completă a sistemului nervos și a țesuturilor moi.',
        'Se recomandă reducerea greutăților cu 30-50% sau a volumului (numărul de seturi) cu 50%.',
        'Planifică un deload la fiecare 6-10 săptămâni sau imediat ce observi o stagnare a forței pe mai multe sesiuni.'
    ] 
  }
];
