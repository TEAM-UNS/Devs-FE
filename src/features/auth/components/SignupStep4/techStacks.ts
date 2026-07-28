export interface TechTag {
  /** 그룹 안에서 고유한 값 */
  id: string
  /** 칩 라벨 */
  label: string
}

export interface TechStackGroup {
  /** 전공 id (MAJORS와 같은 키) */
  majorId: string
  /** 그룹 헤더 라벨 */
  label: string
  /** 선택 가능한 기술 스택 */
  tags: TechTag[]
}

/** 라벨을 그대로 id로 쓴다 — 목데이터라 별도 슬러그를 둘 이유가 없다. */
const tags = (...labels: string[]): TechTag[] =>
  labels.map((label) => ({ id: label, label }))

/**
 * 전공별 기술 스택 선택지 (목데이터 — 추후 서버 연동 시 교체).
 * 키는 `MAJORS`의 전공 id와 1:1로 맞춘다. 3단계에서 고른 전공만 4단계에 노출된다.
 */
export const TECH_STACK_GROUPS: TechStackGroup[] = [
  {
    majorId: 'backend',
    label: '백엔드',
    tags: tags(
      'Spring',
      'Node.js',
      'NestJS',
      'Express',
      'Django',
      'FastAPI',
      'Go',
      'Java',
      'Kotlin',
      'Python',
    ),
  },
  {
    majorId: 'frontend',
    label: '프론트엔드',
    tags: tags(
      'React',
      'Next.js',
      'Vue',
      'Nuxt',
      'Svelte',
      'Angular',
      'TypeScript',
      'Tailwind CSS',
      'Redux',
      'React Query',
    ),
  },
  {
    majorId: 'devops',
    label: '데브옵스',
    tags: tags(
      'Docker',
      'Kubernetes',
      'AWS',
      'GCP',
      'Terraform',
      'Jenkins',
      'GitHub Actions',
      'Nginx',
      'Prometheus',
      'Grafana',
    ),
  },
  {
    majorId: 'android',
    label: '안드로이드',
    tags: tags(
      'Kotlin',
      'Java',
      'Jetpack Compose',
      'Coroutines',
      'Hilt',
      'Retrofit',
      'Room',
    ),
  },
  {
    majorId: 'ios',
    label: 'iOS',
    tags: tags(
      'Swift',
      'SwiftUI',
      'UIKit',
      'Combine',
      'Objective-C',
      'Core Data',
    ),
  },
  {
    majorId: 'ai',
    label: '인공지능',
    tags: tags(
      'PyTorch',
      'TensorFlow',
      'scikit-learn',
      'Pandas',
      'NumPy',
      'Hugging Face',
      'OpenCV',
    ),
  },
  {
    majorId: 'database',
    label: '데이터베이스',
    tags: tags(
      'MySQL',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'Oracle',
      'SQLite',
      'Elasticsearch',
    ),
  },
  {
    majorId: 'security',
    label: '정보보안',
    tags: tags(
      'Burp Suite',
      'Wireshark',
      'Nmap',
      'OWASP ZAP',
      'Kali Linux',
      'Metasploit',
    ),
  },
  {
    majorId: 'design',
    label: '디자인',
    tags: tags('Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator'),
  },
  {
    majorId: 'etc',
    label: '기타',
    tags: tags('Git', 'Jira', 'Notion', 'Slack', 'Confluence'),
  },
]
