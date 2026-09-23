// Target roles: label, starter resources, resume keywords [label, 'regex|alternatives'] and technical questions.
import { TECH_QUESTIONS } from './questions.js';

export const ROLES = {
  dev:{label:'Software developer', starter:['freecodecamp','roadmap'],
    kw:[['Java','java'],['Python','python'],['JavaScript','javascript|typescript'],['SQL','sql|mysql|postgres|sqlite'],['Git','git|github|gitlab'],['HTML/CSS','html|css'],['React','react|angular|vue'],['Node.js','node.js|nodejs|express|spring|django|flask'],['REST APIs','rest|api'],['Data structures','data structures|algorithms|dsa'],['OOP','oop|object-oriented|object oriented'],['Testing','testing|unit test|junit|jest'],['Docker','docker'],['Agile','agile|scrum']],
    tech: TECH_QUESTIONS.dev},
  qa:{label:'QA / test engineer', starter:['motesting','selenium'],
    kw:[['Test cases','test case'],['Test plan','test plan|test strategy'],['Manual testing','manual'],['Automation','automation|automated'],['Selenium','selenium|cypress|playwright'],['API testing','postman|api testing|rest assured'],['Bug tracking','jira|bug|defect'],['Regression','regression'],['SDLC/STLC','sdlc|stlc'],['SQL','sql|mysql'],['Java/Python','java|python'],['Agile','agile|scrum'],['TestNG/JUnit','testng|junit|pytest'],['Git','git|github']],
    tech: TECH_QUESTIONS.qa},
  devops:{label:'DevOps / cloud engineer', starter:['linuxjourney','docker'],
    kw:[['Linux','linux|ubuntu'],['Docker','docker|container'],['Kubernetes','kubernetes|k8s'],['CI/CD','ci/cd|jenkins|github actions|gitlab ci'],['Git','git|github|gitlab'],['AWS/Azure/GCP','aws|azure|gcp|google cloud'],['Terraform/Ansible','terraform|ansible|cloudformation'],['Bash/Shell','bash|shell'],['Python','python'],['Monitoring','prometheus|grafana|monitoring'],['Networking','networking|tcp|dns'],['YAML','yaml']],
    tech: TECH_QUESTIONS.devops},
  data:{label:'Data / AI engineer', starter:['kaggle','sqlbolt'],
    kw:[['Python','python'],['SQL','sql|mysql|postgres'],['Pandas','pandas'],['NumPy','numpy'],['Machine learning','machine learning|scikit|sklearn'],['Statistics','statistics|probability'],['Deep learning','tensorflow|pytorch|deep learning|keras'],['Visualization','matplotlib|seaborn|power bi|tableau|visualization'],['Excel','excel'],['Jupyter','jupyter|colab'],['NLP','nlp|natural language'],['Data cleaning','data cleaning|preprocessing|eda']],
    tech: TECH_QUESTIONS.data},
  mobile:{label:'Mobile app developer', starter:['androiddev','roadmap'],
    kw:[['Java','java'],['Kotlin','kotlin'],['Swift','swift'],['Android','android'],['iOS','ios'],['Flutter','flutter|dart'],['React Native','react native'],['UI layouts','xml|layout|storyboard|jetpack compose|swiftui'],['REST APIs','rest|api'],['Local storage','sqlite|room database|core data|userdefaults|shared preferences'],['Git','git|github'],['App store publishing','play store|app store|publish'],['Testing','testing|espresso|xctest']],
    tech: TECH_QUESTIONS.mobile},
  security:{label:'Cybersecurity analyst', starter:['owasp','tryhackme'],
    kw:[['Networking','networking|tcp/ip|tcp|dns'],['Linux','linux|kali'],['OWASP','owasp'],['Wireshark','wireshark'],['Nmap','nmap'],['Pen testing','penetration testing|pentest|ethical hacking'],['Vulnerability','vulnerability|cve'],['SIEM','siem|splunk'],['Encryption','encryption|cryptography'],['Firewall','firewall'],['Incident response','incident response'],['Burp Suite','burp'],['Python','python']],
    tech: TECH_QUESTIONS.security},
  support:{label:'IT support / helpdesk', starter:['messer','linuxjourney'],
    kw:[['Troubleshooting','troubleshoot'],['Windows','windows'],['Linux','linux'],['Networking','networking|tcp/ip|lan|wan'],['Active Directory','active directory'],['Ticketing','ticket|jira|servicenow|zendesk'],['Help desk','help desk|helpdesk|service desk'],['Hardware','hardware'],['DNS/DHCP','dns|dhcp'],['ITIL','itil'],['Office 365','office 365|microsoft 365|m365'],['VPN','vpn'],['Customer service','customer service|customer support'],['Documentation','documentation']],
    tech: TECH_QUESTIONS.support}
};

// Custom role: reuse the closest role's keyword list and question bank, relabeled.
export function nearestRoleKey(title) {
  const t = title.toLowerCase();
  if (/data|machine learning|\bai\b|analytics|scientist/.test(t)) return 'data';
  if (/security|cyber|soc analyst|penetration/.test(t)) return 'security';
  if (/mobile|android|ios app|app developer/.test(t)) return 'mobile';
  if (/test|qa|quality assurance/.test(t)) return 'qa';
  if (/devops|site reliability|\bsre\b|cloud|platform engineer/.test(t)) return 'devops';
  if (/support|helpdesk|help desk|desktop support|it support|service desk/.test(t)) return 'support';
  return 'dev';
}

// Returns the role object for a key. 'custom' borrows from the nearest built-in role.
export function getRole(key, custom) {
  if (key === 'custom' && custom) return Object.assign({}, ROLES[custom.baseKey], { label: custom.label });
  return ROLES[key];
}
