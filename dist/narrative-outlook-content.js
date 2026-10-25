// Original 09B catalogue retained verbatim for saved version-1 outlooks and neutral fallbacks.
// These are private assessments, never public utterances or evidence of future events.
export const OUTLOOK_TEXT={
 watch:'I would prefer to learn what my neighbours intend before helping them accomplish it.',
 attention:'I should attend to affairs close to home. Uncertainty is no reason to neglect them.',
 ambition:'Our position invites ambition. Whether our neighbours will oblige is another question.',
 measured:'We have advantages at the frontier. I would rather understand them than boast of them.',
 bluff:'A bold appearance may conceal a weak position. I must hope it conceals ours.',
 restraint:'Our position is not strong enough for carelessness. Dignity will have to wait.',
 defence:'Our neighbour has the stronger position. I would welcome restraint, but shall not presume upon it.',
 secure:'We need not mistake a stronger position for safety. Our neighbour may be less prudent than I hope.',
 companyFrontier:'The Company holds the country beyond our frontier. Its difficulties may offer an opening, but its strength is not mine to assume.',
 exposure:'Company authority here may yet be tested. I should judge its position with care.',
 subject:'Dependence has its inconveniences. Attempting to end it may have rather greater ones.',
 capital:'Authority over another court is easier to claim than to keep. I should remember that before demanding more.',
 occupation:'Discontent gives the Company another difficulty. I cannot yet tell whose opportunity it may become.',
 secondary:'Disorder elsewhere may expose the Company here as well. I should not confuse the possibility with deliverance.',
 alarm:'The prospect of further conflict deserves attention. I would prefer my court to survive other people’s ambitions.',
 opportunity:'If conflict does spread, a watchful court may find an opening. It may also find a stronger enemy.',
 mixed:'There may still be room for accommodation. I would keep caution close at hand while looking for it.',
 grievance:'Their possession of my country has not persuaded me of their right to it.',
 qualified:'I can acknowledge their help without consenting to their rule.',
 commerce:'A commercial opening is worth considering. What it will bring is a different question.',
 disruption:'Commerce is less reliable than I would wish. I should be careful what I build upon it.',
 sanguine:'I am inclined to trust our position. Inclination, regrettably, is not a guarantee.'
};

// Exact user-approved catalogue. Blocked entries are retained for review, never selectable.
export const APPROVED_OUTLOOKS=[
 {
  "id": "09B-imperial-ambition-proud",
  "family": "strong-attacker",
  "voice": "proud",
  "text": "My neighbours call their borders ancient. Age, I find, is an insufficient defence of an argument."
 },
 {
  "id": "09B-imperial-ambition-calculating",
  "family": "strong-attacker",
  "voice": "calculating",
  "text": "It is seldom necessary to threaten a neighbour when one can leave him to study the map."
 },
 {
  "id": "09B-imperial-ambition-vain",
  "family": "strong-attacker",
  "voice": "vain",
  "text": "A larger realm would be a burden, certainly. I am prepared to shoulder it."
 },
 {
  "id": "09B-imperial-ambition-wary",
  "family": "strong-attacker",
  "voice": "wary",
  "text": "An advantage invites foolish counsel almost as reliably as a disadvantage invites panic."
 },
 {
  "id": "09B-weak-aggressor-defiant",
  "family": "weak-attacker",
  "voice": "defiant",
  "text": "My neighbours possess the greater strength. Fortunately, they cannot prevent me from disliking them."
 },
 {
  "id": "09B-weak-aggressor-scheming",
  "family": "weak-attacker",
  "voice": "scheming",
  "text": "The larger court expects a challenge in arms. I shall consider whether there are other ways to unsettle it."
 },
 {
  "id": "09B-weak-aggressor-deluded",
  "family": "weak-attacker",
  "voice": "deluded",
  "text": "Their armies are numerous. Numbers have never impressed me when I was not required to count them."
 },
 {
  "id": "09B-weak-aggressor-pragmatic",
  "family": "weak-attacker",
  "voice": "pragmatic",
  "text": "A gesture of boldness costs less than a war. I should prefer to pay for the gesture."
 },
 {
  "id": "09B-weak-defender-nervous",
  "family": "weak-defender",
  "voice": "nervous",
  "text": "I find myself wondering what demands our neighbour will make when courtesy ceases to be sufficient."
 },
 {
  "id": "09B-weak-defender-proud",
  "family": "weak-defender",
  "voice": "proud",
  "text": "Let them mistake a smaller court for a court without dignity. The error may prove expensive."
 },
 {
  "id": "09B-weak-defender-diplomatic",
  "family": "weak-defender",
  "voice": "diplomatic",
  "text": "I would rather send an envoy today than learn the price of sending one tomorrow."
 },
 {
  "id": "09B-weak-defender-denial",
  "family": "weak-defender",
  "voice": "denial",
  "text": "There is far too much discussion of our frontier. I should prefer to hear something about the gardens."
 },
 {
  "id": "09B-strong-defender-contemptuous",
  "family": "strong-defender",
  "voice": "contemptuous",
  "text": "They have courage in abundance, it seems. I hope they have made similar provision for judgment."
 },
 {
  "id": "09B-strong-defender-careful",
  "family": "strong-defender",
  "voice": "careful",
  "text": "A weaker neighbour may be dangerous precisely because its ruler has so little to lose."
 },
 {
  "id": "09B-strong-defender-magnanimous",
  "family": "strong-defender",
  "voice": "magnanimous",
  "text": "Should they seek dignity, I hope they will find a way to preserve it without testing my patience."
 },
 {
  "id": "09B-strong-defender-dismissive",
  "family": "strong-defender",
  "voice": "dismissive",
  "text": "My court urges preparations. I have granted them permission to be frightened on my behalf.",
  "blocked": "No recorded court request or grant of permission to prepare."
 },
 {
  "id": "09B-company-border-opportunist",
  "family": "company-frontier",
  "voice": "opportunist",
  "text": "The Company's possessions extend rather further than its attention can comfortably reach. Perhaps that deserves examination."
 },
 {
  "id": "09B-company-border-careful",
  "family": "company-frontier",
  "voice": "careful",
  "text": "The Company's defences are difficult to judge from a distance. I should not mistake silence for weakness."
 },
 {
  "id": "09B-company-border-hostile",
  "family": "company-frontier",
  "voice": "hostile",
  "text": "They have made a business of ruling other people's country. I wonder how they enjoy having theirs watched."
 },
 {
  "id": "09B-company-border-mercantile",
  "family": "company-frontier",
  "voice": "mercantile",
  "text": "An open road into Company territory can carry either merchants or soldiers. I would strongly prefer to choose which.",
  "blocked": "The unchanged 09A projection has regional opportunity counts, not proof of a particular open cross-border road."
 },
 {
  "id": "09B-company-threat-anxious",
  "family": "company-primary",
  "voice": "anxious",
  "text": "Authority here is loudly proclaimed and quietly doubted. That is an uncomfortable combination."
 },
 {
  "id": "09B-company-threat-deluded",
  "family": "company-primary",
  "voice": "deluded",
  "text": "The Company's position cannot be so precarious as some suggest. Surely a government of this size would have noticed."
 },
 {
  "id": "09B-company-threat-resentful",
  "family": "company-primary",
  "voice": "resentful",
  "text": "The Company's assurances grow firmer whenever its position grows less certain.",
  "blocked": "No structured evidence establishes that repeated Company assurances grew firmer as its position deteriorated."
 },
 {
  "id": "09B-company-threat-pragmatic",
  "family": "company-primary",
  "voice": "pragmatic",
  "text": "Whoever claims to govern this country must first persuade its people that the claim matters."
 },
 {
  "id": "09B-secondary-danger-watchful",
  "family": "company-secondary",
  "voice": "watchful",
  "text": "The disturbance may begin elsewhere. That does not mean it will remain there."
 },
 {
  "id": "09B-secondary-danger-resentful",
  "family": "company-secondary",
  "voice": "resentful",
  "text": "When Company authority falters in one province, every other province notices."
 },
 {
  "id": "09B-secondary-danger-naive",
  "family": "company-secondary",
  "voice": "naive",
  "text": "These disturbances belong to other governors. I see no cause for them to trouble us."
 },
 {
  "id": "09B-secondary-danger-steadfast",
  "family": "company-secondary",
  "voice": "steadfast",
  "text": "There is no benefit in borrowing panic from our neighbours. Nor should we borrow their complacency."
 },
 {
  "id": "09B-occupation-wounded",
  "family": "occupied-discontent",
  "voice": "wounded",
  "text": "They have soldiers, laws and a governor. Yet they cannot command affection. I take a modest pleasure in that.",
  "blocked": "Company control does not establish a current garrison or a particular occupied Governor office."
 },
 {
  "id": "09B-occupation-nervous",
  "family": "occupied-discontent",
  "voice": "nervous",
  "text": "I hear discontent wherever I turn. I wonder whether the Company's officials hear it too."
 },
 {
  "id": "09B-occupation-calculating",
  "family": "occupied-discontent",
  "voice": "calculating",
  "text": "Discontent is not an army. But it can make an army's work much harder."
 },
 {
  "id": "09B-occupation-deluded",
  "family": "occupied-discontent",
  "voice": "deluded",
  "text": "The people complain because they feel sufficiently secure to do so. I shall take it as a compliment."
 },
 {
  "id": "09B-subject-restless",
  "family": "subject",
  "voice": "restless",
  "text": "I have bowed often enough to remember the shape of the floor. I should like to see the view from standing.",
  "blocked": "Subordination does not establish repeated personal ceremonial bowing."
 },
 {
  "id": "09B-subject-pragmatic",
  "family": "subject",
  "voice": "pragmatic",
  "text": "Independence is a handsome word. Keeping it may require less handsome arrangements."
 },
 {
  "id": "09B-subject-loyal",
  "family": "subject",
  "voice": "loyal",
  "text": "A distant sovereign is an inconvenience. The disorder left by overthrowing one may be worse."
 },
 {
  "id": "09B-subject-rash",
  "family": "subject",
  "voice": "rash",
  "text": "My overlord has mistaken obedience for admiration. I expect the distinction will surprise him."
 },
 {
  "id": "09B-capital-outraged",
  "family": "capital",
  "voice": "outraged",
  "text": "They have enjoyed the protection of my throne and now question its authority. An unfortunate understanding of gratitude.",
  "blocked": "Allegiance and possible rebellion do not establish earlier protection or an actual challenge to authority."
 },
 {
  "id": "09B-capital-politic",
  "family": "capital",
  "voice": "politic",
  "text": "A subject who whispers of independence is asking a question. The art lies in deciding how loudly to answer."
 },
 {
  "id": "09B-capital-alarmed",
  "family": "capital",
  "voice": "alarmed",
  "text": "Empires are seldom lost all at once. They begin with a court that decides not to listen."
 },
 {
  "id": "09B-capital-dismissive",
  "family": "capital",
  "voice": "dismissive",
  "text": "Their discontent is a passing fashion. I do not propose to dress my government to suit it."
 },
 {
  "id": "09B-dangerous-climate-ambitious",
  "family": "military-climate",
  "voice": "ambitious",
  "text": "The courts grow restless. I must ensure that when fortunes turn, my enemies have other enemies to occupy them."
 },
 {
  "id": "09B-dangerous-climate-anxious",
  "family": "military-climate",
  "voice": "anxious",
  "text": "There is talk of trouble in every direction. I have ceased asking where it will begin."
 },
 {
  "id": "09B-dangerous-climate-predatory",
  "family": "military-climate",
  "voice": "predatory",
  "text": "The cautious are counting their defences. I find myself counting their distractions."
 },
 {
  "id": "09B-dangerous-climate-complacent",
  "family": "military-climate",
  "voice": "complacent",
  "text": "The fearful speak as though the whole country were in danger. I see no reason to join their chorus."
 },
 {
  "id": "09B-uncertain-diplomacy-hopeful",
  "family": "mixed-climate",
  "voice": "hopeful",
  "text": "If the courts will still talk, there may yet be something worth saving from their quarrels."
 },
 {
  "id": "09B-uncertain-diplomacy-skeptical",
  "family": "mixed-climate",
  "voice": "skeptical",
  "text": "Every court professes affection for peace. I wonder how many would recognize it without an armed escort."
 },
 {
  "id": "09B-uncertain-diplomacy-calculating",
  "family": "mixed-climate",
  "voice": "calculating",
  "text": "A frightened neighbour may offer better terms than a defeated one. I should prefer to learn the difference."
 },
 {
  "id": "09B-uncertain-diplomacy-fatigued",
  "family": "mixed-climate",
  "voice": "fatigued",
  "text": "I shall welcome a settlement, provided no one asks me to celebrate it before it exists."
 },
 {
  "id": "09B-conquest-grievance-bitter",
  "family": "grievance",
  "voice": "bitter",
  "text": "Their possession of my country has not persuaded me of their right to it."
 },
 {
  "id": "09B-conquest-grievance-ceremonial",
  "family": "grievance",
  "voice": "ceremonial",
  "text": "I receive their officials with every courtesy. Courtesy, I am pleased to say, requires no affection.",
  "blocked": "No recorded repeated reception of Company officials with courtesy."
 },
 {
  "id": "09B-conquest-grievance-patient",
  "family": "grievance",
  "voice": "patient",
  "text": "I need not speak of the conquest every day to remember it every morning."
 },
 {
  "id": "09B-conquest-grievance-scornful",
  "family": "grievance",
  "voice": "scornful",
  "text": "The Company has taken the revenues. It appears to expect gratitude as an additional tax.",
  "blocked": "Tax demands do not establish receipt of revenues; money remains untracked."
 },
 {
  "id": "09B-qualified-gratitude-conflicted",
  "family": "qualified",
  "voice": "conflicted",
  "text": "The Company has helped preserve my position more than once. Gratitude is a difficult companion to resentment.",
  "blocked": "Direct interventions improve a region, but do not establish that this ruler’s personal position was preserved more than once."
 },
 {
  "id": "09B-qualified-gratitude-grudging",
  "family": "qualified",
  "voice": "grudging",
  "text": "I can acknowledge what their help achieved without admiring why they offered it."
 },
 {
  "id": "09B-qualified-gratitude-pragmatic",
  "family": "qualified",
  "voice": "pragmatic",
  "text": "We have learned to accomplish certain things together. I have not learned to call the arrangement just.",
  "blocked": "Company interventions and gratitude do not establish joint action by this ruler."
 },
 {
  "id": "09B-qualified-gratitude-proud",
  "family": "qualified",
  "voice": "proud",
  "text": "They may claim my thanks for their assistance. My allegiance is another matter entirely."
 },
 {
  "id": "09B-commerce-pragmatic",
  "family": "commercial-disruption",
  "voice": "pragmatic",
  "text": "A closed road can quiet a market without settling a single argument."
 },
 {
  "id": "09B-commerce-anxious",
  "family": "commercial-disruption",
  "voice": "anxious",
  "text": "I should prefer that trade continued without requiring so many explanations for its absence.",
  "blocked": "A disrupted opportunity does not establish that actual trade had occurred and is now absent."
 },
 {
  "id": "09B-commerce-opportunist",
  "family": "commercial-disruption",
  "voice": "opportunist",
  "text": "Where the usual trade cannot pass, someone will seek another route. I should like to know who."
 },
 {
  "id": "09B-commerce-dismissive",
  "family": "commercial-disruption",
  "voice": "dismissive",
  "text": "My advisers are troubled by the absence of trade. I am more troubled by their appetite for discussing it.",
  "blocked": "No recorded adviser conversation, or proof of actual trade absence."
 }
];
Object.assign(OUTLOOK_TEXT,Object.fromEntries(APPROVED_OUTLOOKS.map(e=>[e.id,e.text])));
