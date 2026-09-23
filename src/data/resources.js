// Learning resources (links) and the rules that map a missing skill to a topic.
// RES = every resource; TOPIC_RES = used by the Report; LEARN_RES = used by the Learn page.

export const RES = {
  neetcode:{n:'NeetCode roadmap',u:'https://neetcode.io/',w:'Practice arrays, hash maps, and other interview staples in order.'},
  bigo:{n:'Big-O Cheat Sheet',u:'https://www.bigocheatsheet.com/',w:'Quick reference for time and space complexity.'},
  mdn:{n:'MDN Learn web development',u:'https://developer.mozilla.org/en-US/docs/Learn',w:'Solid HTTP, HTML, CSS, and JavaScript fundamentals.'},
  sqlbolt:{n:'SQLBolt',u:'https://sqlbolt.com/',w:'Short interactive SQL lessons, including joins.'},
  cs50:{n:'Harvard CS50x',u:'https://cs50.harvard.edu/x/',w:'Free course covering core computer science ideas.'},
  gitbranching:{n:'Learn Git Branching',u:'https://learngitbranching.js.org/',w:'Interactive practice with branches, merges, and conflicts.'},
  motesting:{n:'Ministry of Testing',u:'https://www.ministryoftesting.com/',w:'Testing concepts, bug reports, and career advice.'},
  selenium:{n:'Selenium documentation',u:'https://www.selenium.dev/documentation/',w:'Start browser automation with the official guide.'},
  docker:{n:'Docker: Get started',u:'https://docs.docker.com/get-started/',w:'Containers and images explained by doing.'},
  k8s:{n:'Kubernetes basics tutorial',u:'https://kubernetes.io/docs/tutorials/kubernetes-basics/',w:'Pods, deployments, and scaling in a hands-on tutorial.'},
  linuxjourney:{n:'Linux Journey',u:'https://linuxjourney.com/',w:'Command line, processes, and troubleshooting basics.'},
  kaggle:{n:'Kaggle Learn',u:'https://www.kaggle.com/learn',w:'Short hands-on lessons in Python, pandas, and machine learning.'},
  owasp:{n:'OWASP Top 10',u:'https://owasp.org/www-project-top-ten/',w:'The web security risks interviewers ask about most.'},
  tryhackme:{n:'TryHackMe',u:'https://tryhackme.com/',w:'Guided labs for security fundamentals.'},
  messer:{n:'Professor Messer',u:'https://www.professormesser.com/',w:'Free video courses on networking and IT support.'},
  freecodecamp:{n:'freeCodeCamp',u:'https://www.freecodecamp.org/',w:'Free projects to build a portfolio.'},
  roadmap:{n:'roadmap.sh',u:'https://roadmap.sh/',w:'Step-by-step skill roadmaps for each IT role.'},
  androiddev:{n:'Android Developer Fundamentals',u:'https://developer.android.com/courses',w:'Free official courses covering Android basics end to end.'},
  awscp:{n:'AWS Cloud Practitioner Essentials',u:'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',w:'Free intro to core AWS services and cloud concepts.'},
  terraform:{n:'Terraform: Get Started',u:'https://developer.hashicorp.com/terraform/tutorials/aws-get-started',w:'Hands-on tutorial for infrastructure as code.'},
  exceljet:{n:'ExcelJet',u:'https://exceljet.net/',w:'Short, practical Excel formulas and shortcuts.'},
  agilecoach:{n:'Atlassian Agile Coach',u:'https://www.atlassian.com/agile',w:'Plain-language guide to Agile and Scrum.'}
};
export const TOPIC_RES = {
  dsa:['neetcode','bigo'], api:['mdn'], db:['sqlbolt'], oop:['cs50'], git:['gitbranching'],
  testing:['motesting','selenium'], devops:['docker','k8s'], linux:['linuxjourney'], ml:['kaggle'],
  security:['owasp','tryhackme'], net:['messer'], support:['messer','linuxjourney'], mobile:['androiddev','roadmap']
};

// Buckets a missing role-keyword can fall into, matched against its detection pattern.
export const TOPIC_HINTS = [
  [/java|python|javascript|typescript|c\+\+/, 'lang'],
  [/html|css|react|angular|vue|node|express|spring|django|flask/, 'web'],
  [/rest|api|postman|rest assured/, 'api'],
  [/sql|mysql|postgres|sqlite|database/, 'db'],
  [/git|github|gitlab/, 'git'],
  [/data structures|algorithms|dsa/, 'dsa'],
  [/oop|object-oriented|object oriented/, 'oop'],
  [/testing|unit test|junit|jest|selenium|cypress|playwright|testng|pytest|manual|automation|regression|sdlc|stlc|bug|defect|jira/, 'testing'],
  [/docker|container|kubernetes|k8s|ci\/cd|jenkins|terraform|ansible|cloudformation|yaml|monitoring|prometheus|grafana/, 'devops'],
  [/aws|azure|gcp|google cloud/, 'cloud'],
  [/linux|ubuntu|kali|bash|shell/, 'linux'],
  [/pandas|numpy|scikit|sklearn|machine learning|statistics|probability|tensorflow|pytorch|deep learning|keras|nlp|matplotlib|seaborn|tableau|power bi|visualization|jupyter|colab|data cleaning|preprocessing|eda/, 'ml'],
  [/excel/, 'excel'],
  [/owasp|wireshark|nmap|penetration|pentest|ethical hacking|vulnerability|cve|siem|splunk|encryption|cryptography|firewall|incident response|burp/, 'security'],
  [/networking|tcp|dns|dhcp|vpn|lan|wan/, 'net'],
  [/windows|active directory|ticket|help desk|helpdesk|service desk|hardware|itil|office 365|microsoft 365|m365|customer service|documentation/, 'support'],
  [/agile|scrum/, 'agile'],
  [/android|\bios\b|kotlin|swift|flutter|dart|react native|xcode|xctest|espresso|play store|app store|storyboard|jetpack compose|swiftui/, 'mobile']
];
export function guessTopic(alts) {
  const low = alts.toLowerCase();
  for (const [re, topic] of TOPIC_HINTS) if (re.test(low)) return topic;
  return 'general';
}
export const LEARN_RES = {
  lang:['freecodecamp','cs50'], web:['mdn','freecodecamp'], api:['mdn'], db:['sqlbolt'], git:['gitbranching'],
  dsa:['neetcode','bigo'], oop:['cs50'], testing:['motesting','selenium'], devops:['docker','k8s'],
  cloud:['awscp','terraform'], linux:['linuxjourney'], ml:['kaggle'], excel:['exceljet'],
  security:['owasp','tryhackme'], net:['messer'], support:['messer','linuxjourney'], agile:['agilecoach'],
  mobile:['androiddev','roadmap'], general:['roadmap']
};
