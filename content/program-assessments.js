/* ELDI EDU: 55 originalnih praktičnih zadataka. Javni primjeri, bez skrivenih testova. */
(function(root){'use strict';const tasks=[
  {
    "id": "pa-zbir",
    "grade": 5,
    "title": "Zbir velikih cijelih brojeva",
    "category": "Brojevi i izrazi",
    "difficulty": 1,
    "statement": "Učitaj dva cijela broja i ispiši njihov zbir.",
    "inputFormat": "Jedan red: a b.",
    "outputFormat": "Jedan cijeli broj. Ograničenja: −10⁹ ≤ a,b ≤ 10⁹.",
    "constraints": "−10⁹ ≤ a,b ≤ 10⁹.",
    "concepts": [
      "Sabiranje",
      "Cijeli brojevi",
      "Provjeri nulu i negativne vrijednosti."
    ],
    "sampleTests": [
      {
        "input": "7 5\n",
        "output": "12\n"
      },
      {
        "input": "-4 9\n",
        "output": "5\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-5",
      "Brojevi i izrazi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-razlika",
    "grade": 5,
    "title": "Promjena temperature",
    "category": "Brojevi i izrazi",
    "difficulty": 1,
    "statement": "Prvi broj je jutarnja, a drugi večernja temperatura. Ispiši večernju minus jutarnju temperaturu.",
    "inputFormat": "Jedan red: jutarnja večernja.",
    "outputFormat": "Cijeli broj promjene. Ograničenja: temperature od −100 do 100.",
    "constraints": "temperature od −100 do 100.",
    "concepts": [
      "Oduzimanje",
      "Predznak",
      "Redoslijed oduzimanja je važan."
    ],
    "sampleTests": [
      {
        "input": "8 17\n",
        "output": "9\n"
      },
      {
        "input": "5 -3\n",
        "output": "-8\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-5",
      "Brojevi i izrazi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-proizvod",
    "grade": 5,
    "title": "Redovi i sjedišta",
    "category": "Brojevi i izrazi",
    "difficulty": 1,
    "statement": "Sala ima r redova i s sjedišta u svakom redu. Koliko ukupno ima sjedišta?",
    "inputFormat": "Jedan red: r s.",
    "outputFormat": "Broj sjedišta. Ograničenja: 0 ≤ r,s ≤ 10⁶.",
    "constraints": "0 ≤ r,s ≤ 10⁶.",
    "concepts": [
      "Množenje",
      "Veliki rezultat",
      "Rezultat može biti veći od 32-bitnog cijelog broja."
    ],
    "sampleTests": [
      {
        "input": "12 24\n",
        "output": "288\n"
      },
      {
        "input": "1 8\n",
        "output": "8\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-5",
      "Brojevi i izrazi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-podjela",
    "grade": 5,
    "title": "Podjela paketa s ostatkom",
    "category": "Brojevi i izrazi",
    "difficulty": 1,
    "statement": "Podijeli n predmeta u pakete od k predmeta. Ispiši broj punih paketa i preostalih predmeta.",
    "inputFormat": "Jedan red: n k.",
    "outputFormat": "Dva broja: količnik ostatak. Ograničenja: 0 ≤ n ≤ 10⁹; 1 ≤ k ≤ 10⁶.",
    "constraints": "0 ≤ n ≤ 10⁹; 1 ≤ k ≤ 10⁶.",
    "concepts": [
      "Cjelobrojno dijeljenje",
      "Ostatak",
      "Pun paket zahtijeva k predmeta."
    ],
    "sampleTests": [
      {
        "input": "23 5\n",
        "output": "4 3\n"
      },
      {
        "input": "24 6\n",
        "output": "4 0\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-5",
      "Brojevi i izrazi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-max-tri",
    "grade": 5,
    "title": "Najveći od tri broja",
    "category": "Grananje",
    "difficulty": 1,
    "statement": "Učitaj tri cijela broja i ispiši najveći.",
    "inputFormat": "Jedan red: a b c.",
    "outputFormat": "Najveći broj. Ograničenja: −10⁹ ≤ a,b,c ≤ 10⁹.",
    "constraints": "−10⁹ ≤ a,b,c ≤ 10⁹.",
    "concepts": [
      "Uslovi",
      "Poređenje",
      "Najveći broj može biti ponovljen."
    ],
    "sampleTests": [
      {
        "input": "3 9 5\n",
        "output": "9\n"
      },
      {
        "input": "8 8 1\n",
        "output": "8\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-5",
      "Grananje"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-sort-tri",
    "grade": 5,
    "title": "Poredaj tri rezultata",
    "category": "Grananje",
    "difficulty": 2,
    "statement": "Ispiši tri broja u neopadajućem poretku. Jednake vrijednosti zadrži.",
    "inputFormat": "Jedan red s tri cijela broja.",
    "outputFormat": "Tri broja od najmanjeg do najvećeg. Ograničenja: apsolutna vrijednost do 10⁹.",
    "constraints": "apsolutna vrijednost do 10⁹.",
    "concepts": [
      "Poredak",
      "Zamjena",
      "Uporedi i zamijeni pogrešno poredane parove."
    ],
    "sampleTests": [
      {
        "input": "8 2 5\n",
        "output": "2 5 8\n"
      },
      {
        "input": "4 4 1\n",
        "output": "1 4 4\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-5",
      "Grananje"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-pravougaonik",
    "grade": 5,
    "title": "Obim i površina pravougaonika",
    "category": "Geometrija u kodu",
    "difficulty": 1,
    "statement": "Za stranice a i b ispiši obim, a zatim površinu pravougaonika.",
    "inputFormat": "Jedan red: a b.",
    "outputFormat": "Dva cijela broja: obim površina. Ograničenja: 1 ≤ a,b ≤ 10⁶.",
    "constraints": "1 ≤ a,b ≤ 10⁶.",
    "concepts": [
      "Formule",
      "Obim",
      "Površina"
    ],
    "sampleTests": [
      {
        "input": "3 5\n",
        "output": "16 15\n"
      },
      {
        "input": "4 4\n",
        "output": "16 16\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-5",
      "Geometrija u kodu"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-trajanje",
    "grade": 5,
    "title": "Sekunde u sate, minute i sekunde",
    "category": "Brojevi i izrazi",
    "difficulty": 2,
    "statement": "Pretvori trajanje n sekundi u pune sate, preostale minute i preostale sekunde. Sati mogu biti veći od 23.",
    "inputFormat": "Jedan cijeli broj n.",
    "outputFormat": "Tri broja: sati minute sekunde. Ograničenja: 0 ≤ n ≤ 10⁹.",
    "constraints": "0 ≤ n ≤ 10⁹.",
    "concepts": [
      "Jedinice vremena",
      "Dijeljenje",
      "Ostatak"
    ],
    "sampleTests": [
      {
        "input": "3661\n",
        "output": "1 1 1\n"
      },
      {
        "input": "125\n",
        "output": "0 2 5\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-5",
      "Brojevi i izrazi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-racun",
    "grade": 5,
    "title": "Račun u feningima",
    "category": "Brojevi i izrazi",
    "difficulty": 2,
    "statement": "Cijena jednog proizvoda je c feninga, količina je k, a kupac plaća p feninga. Ako je p dovoljan, ispiši kusur; inače ispiši NEDOVOLJNO.",
    "inputFormat": "Jedan red: c k p.",
    "outputFormat": "Kusur ili NEDOVOLJNO. Ograničenja: 0 ≤ c,k ≤ 10⁶; 0 ≤ p ≤ 10¹².",
    "constraints": "0 ≤ c,k ≤ 10⁶; 0 ≤ p ≤ 10¹².",
    "concepts": [
      "Cijena",
      "Uslov",
      "Računaj u cijelim feningima."
    ],
    "sampleTests": [
      {
        "input": "250 3 1000\n",
        "output": "250\n"
      },
      {
        "input": "150 2 200\n",
        "output": "NEDOVOLJNO\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-5",
      "Brojevi i izrazi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-zadnja-cifra",
    "grade": 5,
    "title": "Zadnja cifra broja",
    "category": "Cifre",
    "difficulty": 1,
    "statement": "Ispiši zadnju decimalnu cifru apsolutne vrijednosti broja n.",
    "inputFormat": "Jedan cijeli broj n.",
    "outputFormat": "Jedna cifra od 0 do 9. Ograničenja: −10¹² ≤ n ≤ 10¹².",
    "constraints": "−10¹² ≤ n ≤ 10¹².",
    "concepts": [
      "Ostatak",
      "Apsolutna vrijednost",
      "Negativan predznak nije cifra."
    ],
    "sampleTests": [
      {
        "input": "1234\n",
        "output": "4\n"
      },
      {
        "input": "-567\n",
        "output": "7\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-5",
      "Cifre"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-zbir-cifara",
    "grade": 5,
    "title": "Zbir svih cifara",
    "category": "Cifre",
    "difficulty": 2,
    "statement": "Ispiši zbir decimalnih cifara apsolutne vrijednosti n.",
    "inputFormat": "Jedan cijeli broj n.",
    "outputFormat": "Zbir cifara. Ograničenja: −10¹² ≤ n ≤ 10¹².",
    "constraints": "−10¹² ≤ n ≤ 10¹².",
    "concepts": [
      "Petlja",
      "Cifre",
      "Nakon ostatka podijeli broj sa 10."
    ],
    "sampleTests": [
      {
        "input": "5092\n",
        "output": "16\n"
      },
      {
        "input": "-123\n",
        "output": "6\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-5",
      "Cifre"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-parnost",
    "grade": 6,
    "title": "Paran ili neparan",
    "category": "Djeljivost",
    "difficulty": 1,
    "statement": "Ispiši PARAN ako je n paran, inače NEPARAN.",
    "inputFormat": "Jedan cijeli broj n.",
    "outputFormat": "PARAN ili NEPARAN. Ograničenja: −10⁹ ≤ n ≤ 10⁹.",
    "constraints": "−10⁹ ≤ n ≤ 10⁹.",
    "concepts": [
      "Djeljivost sa 2",
      "Nula je parna."
    ],
    "sampleTests": [
      {
        "input": "12\n",
        "output": "PARAN\n"
      },
      {
        "input": "7\n",
        "output": "NEPARAN\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-6",
      "Djeljivost"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-djeljivost",
    "grade": 6,
    "title": "Pravilo djeljivosti u programu",
    "category": "Djeljivost",
    "difficulty": 1,
    "statement": "Za n i d ispiši DA ako je n djeljiv sa d, inače NE.",
    "inputFormat": "Jedan red: n d; d je iz skupa 2,4,5,6,9,10,15,25.",
    "outputFormat": "DA ili NE. Ograničenja: 0 ≤ n ≤ 10¹².",
    "constraints": "0 ≤ n ≤ 10¹².",
    "concepts": [
      "Ostatak",
      "Zadati djelilac",
      "Ostatak nula znači djeljivost."
    ],
    "sampleTests": [
      {
        "input": "144 9\n",
        "output": "DA\n"
      },
      {
        "input": "26 25\n",
        "output": "NE\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-6",
      "Djeljivost"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-nzd",
    "grade": 6,
    "title": "Najveći zajednički djelilac",
    "category": "Teorija brojeva",
    "difficulty": 2,
    "statement": "Izračunaj NZD(a,b). Važi NZD(0,b)=b i NZD(a,0)=a; oba broja nisu istovremeno nula.",
    "inputFormat": "Jedan red: a b.",
    "outputFormat": "NZD. Ograničenja: 0 ≤ a,b ≤ 10⁹.",
    "constraints": "0 ≤ a,b ≤ 10⁹.",
    "concepts": [
      "Euklidov algoritam",
      "Ostatak",
      "Ponavljaj zamjenu (a,b) sa (b,a%b)."
    ],
    "sampleTests": [
      {
        "input": "18 24\n",
        "output": "6\n"
      },
      {
        "input": "17 13\n",
        "output": "1\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-6",
      "Teorija brojeva"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-nzs",
    "grade": 6,
    "title": "Najmanji zajednički sadržalac",
    "category": "Teorija brojeva",
    "difficulty": 2,
    "statement": "Izračunaj NZS dva pozitivna broja.",
    "inputFormat": "Jedan red: a b.",
    "outputFormat": "NZS. Ograničenja: 1 ≤ a,b ≤ 10⁶.",
    "constraints": "1 ≤ a,b ≤ 10⁶.",
    "concepts": [
      "NZD",
      "Dijeli prije množenja."
    ],
    "sampleTests": [
      {
        "input": "6 8\n",
        "output": "24\n"
      },
      {
        "input": "5 7\n",
        "output": "35\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-6",
      "Teorija brojeva"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-prost",
    "grade": 6,
    "title": "Prost ili složen broj",
    "category": "Teorija brojeva",
    "difficulty": 2,
    "statement": "Ispiši PROST ako n ima tačno dva pozitivna djelioca, inače NIJE PROST. Brojevi 0 i 1 nisu prosti.",
    "inputFormat": "Jedan cijeli broj n.",
    "outputFormat": "PROST ili NIJE PROST. Ograničenja: 0 ≤ n ≤ 10⁹.",
    "constraints": "0 ≤ n ≤ 10⁹.",
    "concepts": [
      "Definicija prostog broja",
      "Provjeri do korijena."
    ],
    "sampleTests": [
      {
        "input": "17\n",
        "output": "PROST\n"
      },
      {
        "input": "25\n",
        "output": "NIJE PROST\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-6",
      "Teorija brojeva"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-broj-djelilaca",
    "grade": 6,
    "title": "Koliko broj ima djelilaca?",
    "category": "Teorija brojeva",
    "difficulty": 3,
    "statement": "Izbroj sve pozitivne djelioce n, uključujući 1 i n.",
    "inputFormat": "Jedan pozitivan cijeli broj n.",
    "outputFormat": "Broj djelilaca. Ograničenja: 1 ≤ n ≤ 10⁹.",
    "constraints": "1 ≤ n ≤ 10⁹.",
    "concepts": [
      "Parovi djelilaca",
      "Kvadrat ima srednji djelilac samo jednom."
    ],
    "sampleTests": [
      {
        "input": "12\n",
        "output": "6\n"
      },
      {
        "input": "16\n",
        "output": "5\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-6",
      "Teorija brojeva"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-skrati-razlomak",
    "grade": 6,
    "title": "Skrati razlomak",
    "category": "Teorija brojeva",
    "difficulty": 2,
    "statement": "Razlomak a/b skrati do neskrativog oblika. Nazivnik ostaje pozitivan; za nulti brojnik rezultat je 0 1.",
    "inputFormat": "Jedan red: a b.",
    "outputFormat": "Dva broja: skraćeni brojnik nazivnik. Ograničenja: |a| ≤ 10⁹; 1 ≤ b ≤ 10⁹.",
    "constraints": "|a| ≤ 10⁹; 1 ≤ b ≤ 10⁹.",
    "concepts": [
      "NZD",
      "Brojnik",
      "Nazivnik"
    ],
    "sampleTests": [
      {
        "input": "18 24\n",
        "output": "3 4\n"
      },
      {
        "input": "-6 9\n",
        "output": "-2 3\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-6",
      "Teorija brojeva"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-prestupna",
    "grade": 6,
    "title": "Prestupna godina",
    "category": "Grananje",
    "difficulty": 2,
    "statement": "Godina je prestupna ako je djeljiva sa 400, ili je djeljiva sa 4 a nije sa 100. Ispiši DA ili NE.",
    "inputFormat": "Jedna godina g.",
    "outputFormat": "DA ili NE. Ograničenja: 1 ≤ g ≤ 9999.",
    "constraints": "1 ≤ g ≤ 9999.",
    "concepts": [
      "Logički operatori",
      "Izuzetak za stoljeća"
    ],
    "sampleTests": [
      {
        "input": "2024\n",
        "output": "DA\n"
      },
      {
        "input": "2023\n",
        "output": "NE\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-6",
      "Grananje"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-zbir-do-n",
    "grade": 6,
    "title": "Zbir od 1 do n",
    "category": "Petlje",
    "difficulty": 1,
    "statement": "Izračunaj 1+2+…+n. Za n=0 zbir je 0.",
    "inputFormat": "Jedan nenegativan cijeli broj n.",
    "outputFormat": "Zbir. Ograničenja: 0 ≤ n ≤ 10⁹.",
    "constraints": "0 ≤ n ≤ 10⁹.",
    "concepts": [
      "Aritmetički zbir",
      "Formula",
      "Koristi 64-bitni tip u C/C++/Javi."
    ],
    "sampleTests": [
      {
        "input": "5\n",
        "output": "15\n"
      },
      {
        "input": "10\n",
        "output": "55\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-6",
      "Petlje"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-zbir-interval",
    "grade": 6,
    "title": "Zbir cijelog intervala",
    "category": "Petlje",
    "difficulty": 2,
    "statement": "Saberi sve cijele brojeve od a do b, uključujući granice.",
    "inputFormat": "Jedan red: a b, gdje je a ≤ b.",
    "outputFormat": "Zbir. Ograničenja: −10⁶ ≤ a ≤ b ≤ 10⁶.",
    "constraints": "−10⁶ ≤ a ≤ b ≤ 10⁶.",
    "concepts": [
      "Interval",
      "Broj članova",
      "Granice su uključene."
    ],
    "sampleTests": [
      {
        "input": "3 7\n",
        "output": "25\n"
      },
      {
        "input": "-3 2\n",
        "output": "-3\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-6",
      "Petlje"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-zbir-umnozaka",
    "grade": 6,
    "title": "Zbir prvih višekratnika",
    "category": "Petlje",
    "difficulty": 2,
    "statement": "Izračunaj k+2k+…+nk. Za n=0 ispiši 0.",
    "inputFormat": "Jedan red: n k.",
    "outputFormat": "Zbir. Ograničenja: 0 ≤ n ≤ 10⁶; −10⁶ ≤ k ≤ 10⁶.",
    "constraints": "0 ≤ n ≤ 10⁶; −10⁶ ≤ k ≤ 10⁶.",
    "concepts": [
      "Višekratnici",
      "Zbir",
      "Predznak k mijenja predznak zbira."
    ],
    "sampleTests": [
      {
        "input": "4 3\n",
        "output": "30\n"
      },
      {
        "input": "3 -2\n",
        "output": "-12\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-6",
      "Petlje"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-niz-zbir",
    "grade": 7,
    "title": "Zbir elemenata niza",
    "category": "Nizovi",
    "difficulty": 1,
    "statement": "Izračunaj zbir svih elemenata niza.",
    "inputFormat": "Prvi red n, drugi red n cijelih brojeva.",
    "outputFormat": "Zbir. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "constraints": "1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "concepts": [
      "Niz",
      "Akumulator",
      "Počni zbir od nule."
    ],
    "sampleTests": [
      {
        "input": "3\n4 1 7\n",
        "output": "12\n"
      },
      {
        "input": "4\n-5 9 -2 0\n",
        "output": "2\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-7",
      "Nizovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-prvi-maksimum",
    "grade": 7,
    "title": "Položaj prvog maksimuma",
    "category": "Nizovi",
    "difficulty": 2,
    "statement": "Ispiši najveću vrijednost i položaj njenog prvog pojavljivanja. Položaji počinju od 1.",
    "inputFormat": "Prvi red n, drugi red n cijelih brojeva.",
    "outputFormat": "Maksimum i prvi položaj. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "constraints": "1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "concepts": [
      "Indeksiranje",
      "Jednake vrijednosti",
      "Mijenjaj položaj samo za strogo veću vrijednost."
    ],
    "sampleTests": [
      {
        "input": "3\n4 1 7\n",
        "output": "7 3\n"
      },
      {
        "input": "4\n-5 9 -2 0\n",
        "output": "9 2\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-7",
      "Nizovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-iznad-prosjeka",
    "grade": 7,
    "title": "Koliko vrijednosti je iznad prosjeka?",
    "category": "Nizovi",
    "difficulty": 2,
    "statement": "Izbroj elemente strogo veće od aritmetičke sredine cijelog niza.",
    "inputFormat": "Prvi red n, drugi red n brojeva.",
    "outputFormat": "Broj elemenata. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "constraints": "1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "concepts": [
      "Prosjek",
      "Preciznost",
      "Poredi x·n sa zbirom da izbjegneš decimalnu grešku."
    ],
    "sampleTests": [
      {
        "input": "3\n4 1 7\n",
        "output": "1\n"
      },
      {
        "input": "4\n-5 9 -2 0\n",
        "output": "1\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-7",
      "Nizovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-predznaci",
    "grade": 7,
    "title": "Negativni, nule i pozitivni",
    "category": "Nizovi",
    "difficulty": 1,
    "statement": "Izbroj negativne elemente, nule i pozitivne elemente.",
    "inputFormat": "Prvi red n, drugi red n brojeva.",
    "outputFormat": "Tri broja: negativni nule pozitivni. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "constraints": "1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "concepts": [
      "Tri grane",
      "Brojači",
      "Nula pripada svojoj grupi."
    ],
    "sampleTests": [
      {
        "input": "3\n4 1 7\n",
        "output": "0 0 3\n"
      },
      {
        "input": "4\n-5 9 -2 0\n",
        "output": "2 1 1\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-7",
      "Nizovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-obrni-niz",
    "grade": 7,
    "title": "Obrni redoslijed niza",
    "category": "Nizovi",
    "difficulty": 1,
    "statement": "Ispiši sve elemente niza od posljednjeg prema prvom.",
    "inputFormat": "Prvi red n, drugi red n brojeva.",
    "outputFormat": "Obrnuti niz. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "constraints": "1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "concepts": [
      "Indeksi",
      "Obrnuta petlja",
      "Posljednji indeks je n−1."
    ],
    "sampleTests": [
      {
        "input": "3\n4 1 7\n",
        "output": "7 1 4\n"
      },
      {
        "input": "4\n-5 9 -2 0\n",
        "output": "0 -2 9 -5\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-7",
      "Nizovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-razliciti",
    "grade": 7,
    "title": "Različite vrijednosti u poretku",
    "category": "Nizovi",
    "difficulty": 2,
    "statement": "Ispiši broj različitih vrijednosti, a u narednom redu same različite vrijednosti u rastućem poretku.",
    "inputFormat": "Prvi red n, drugi red n brojeva.",
    "outputFormat": "Broj različitih vrijednosti i poredane vrijednosti. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "constraints": "1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "concepts": [
      "Skup",
      "Sortiranje",
      "Svaku vrijednost ispiši jednom."
    ],
    "sampleTests": [
      {
        "input": "3\n4 1 7\n",
        "output": "3\n1 4 7\n"
      },
      {
        "input": "4\n-5 9 -2 0\n",
        "output": "4\n-5 -2 0 9\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-7",
      "Nizovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-prefiks",
    "grade": 7,
    "title": "Zbir intervala pomoću prefiksa",
    "category": "Nizovi",
    "difficulty": 3,
    "statement": "Odgovori na q upita: koliki je zbir elemenata od položaja l do r, uključujući oba?",
    "inputFormat": "Prvi red n q, drugi red niz; zatim q redova l r.",
    "outputFormat": "Za svaki upit jedan zbir. Ograničenja: 1 ≤ n,q ≤ 10⁴; 1 ≤ l ≤ r ≤ n; |aᵢ| ≤ 10⁹.",
    "constraints": "1 ≤ n,q ≤ 10⁴; 1 ≤ l ≤ r ≤ n; |aᵢ| ≤ 10⁹.",
    "concepts": [
      "Prefiksni zbir",
      "Interval",
      "Prazan prefiks na položaju 0 ima zbir 0."
    ],
    "sampleTests": [
      {
        "input": "5 3\n2 -1 4 0 3\n1 5\n2 4\n3 3\n",
        "output": "8\n3\n4\n"
      },
      {
        "input": "1 2\n7\n1 1\n1 1\n",
        "output": "7\n7\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-7",
      "Nizovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-rastuci-segment",
    "grade": 7,
    "title": "Najduži rastući uzastopni segment",
    "category": "Nizovi",
    "difficulty": 3,
    "statement": "Nađi dužinu najdužeg uzastopnog dijela niza u kojem je svaki naredni broj strogo veći od prethodnog.",
    "inputFormat": "Prvi red n; drugi red niz.",
    "outputFormat": "Dužina segmenta. Ograničenja: 1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "constraints": "1 ≤ n ≤ 10⁴; |aᵢ| ≤ 10⁹.",
    "concepts": [
      "Uzastopni segment",
      "Strogo rastuće",
      "Prekid segmenta vraća tekuću dužinu na 1."
    ],
    "sampleTests": [
      {
        "input": "5\n1 2 3 1 2\n",
        "output": "3\n"
      },
      {
        "input": "3\n5 4 3\n",
        "output": "1\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-7",
      "Nizovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-dijagonale",
    "grade": 7,
    "title": "Dvije dijagonale matrice",
    "category": "Matrice",
    "difficulty": 2,
    "statement": "Odvojeno izračunaj zbir glavne i sporedne dijagonale kvadratne matrice. Srednji element, ako postoji, ulazi u oba zbira.",
    "inputFormat": "Prvi red n; zatim n redova od po n brojeva.",
    "outputFormat": "Zbir glavne i zbir sporedne dijagonale. Ograničenja: 1 ≤ n ≤ 100; |element| ≤ 10⁶.",
    "constraints": "1 ≤ n ≤ 100; |element| ≤ 10⁶.",
    "concepts": [
      "Matrica",
      "Indeksi",
      "Glavna: i=j; sporedna: i+j=n−1."
    ],
    "sampleTests": [
      {
        "input": "2\n1 2\n3 4\n",
        "output": "5 5\n"
      },
      {
        "input": "3\n1 2 3\n4 5 6\n7 8 9\n",
        "output": "15 15\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-7",
      "Matrice"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-transponuj",
    "grade": 7,
    "title": "Transponuj pravougaonu matricu",
    "category": "Matrice",
    "difficulty": 3,
    "statement": "Zamijeni redove i kolone matrice.",
    "inputFormat": "Prvi red r c; zatim r redova s po c elemenata.",
    "outputFormat": "c redova s po r elemenata. Ograničenja: 1 ≤ r,c ≤ 100; |element| ≤ 10⁶.",
    "constraints": "1 ≤ r,c ≤ 100; |element| ≤ 10⁶.",
    "concepts": [
      "Redovi",
      "Kolone",
      "Izlazna matrica ima c redova."
    ],
    "sampleTests": [
      {
        "input": "2 3\n1 2 3\n4 5 6\n",
        "output": "1 4\n2 5\n3 6\n"
      },
      {
        "input": "3 1\n7\n8\n9\n",
        "output": "7 8 9\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-7",
      "Matrice"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-rotacija",
    "grade": 7,
    "title": "Kružna rotacija niza udesno",
    "category": "Nizovi",
    "difficulty": 3,
    "statement": "Rotiraj niz k položaja udesno: posljednji elementi prelaze na početak.",
    "inputFormat": "Prvi red n k; drugi red n brojeva.",
    "outputFormat": "Rotirani niz. Ograničenja: 1 ≤ n ≤ 10⁴; 0 ≤ k ≤ 10⁹; |aᵢ| ≤ 10⁹.",
    "constraints": "1 ≤ n ≤ 10⁴; 0 ≤ k ≤ 10⁹; |aᵢ| ≤ 10⁹.",
    "concepts": [
      "Modulo",
      "Rotacija",
      "Prvo svedi k na ostatak pri dijeljenju sa n."
    ],
    "sampleTests": [
      {
        "input": "5 2\n1 2 3 4 5\n",
        "output": "4 5 1 2 3\n"
      },
      {
        "input": "3 1\n7 8 9\n",
        "output": "9 7 8\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-7",
      "Nizovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-palindrom",
    "grade": 8,
    "title": "Palindromski zapis",
    "category": "Stringovi",
    "difficulty": 2,
    "statement": "Riječ sastavljena od malih slova a–z je palindrom ako se jednako čita s obje strane. Ispiši DA ili NE.",
    "inputFormat": "Jedna neprazna riječ, bez razmaka.",
    "outputFormat": "DA ili NE. Ograničenja: do 10⁴ znakova.",
    "constraints": "do 10⁴ znakova.",
    "concepts": [
      "Dva pokazivača",
      "Simetrija"
    ],
    "sampleTests": [
      {
        "input": "radar\n",
        "output": "DA\n"
      },
      {
        "input": "skola\n",
        "output": "NE\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-8",
      "Stringovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-frekvencija",
    "grade": 8,
    "title": "Najčešće slovo",
    "category": "Stringovi",
    "difficulty": 2,
    "statement": "Nađi najčešće slovo riječi. Ako više slova ima isti najveći broj pojavljivanja, izaberi abecedno najmanje.",
    "inputFormat": "Jedna neprazna riječ od slova a–z.",
    "outputFormat": "Slovo i broj pojavljivanja. Ograničenja: dužina do 10⁴.",
    "constraints": "dužina do 10⁴.",
    "concepts": [
      "Brojanje",
      "Pravilo izjednačenja",
      "Prođi slova od a prema z."
    ],
    "sampleTests": [
      {
        "input": "banana\n",
        "output": "a 3\n"
      },
      {
        "input": "cabb\n",
        "output": "b 2\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-8",
      "Stringovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-rijeci",
    "grade": 8,
    "title": "Brojanje riječi u redu",
    "category": "Stringovi",
    "difficulty": 2,
    "statement": "Riječ je maksimalan niz slova između razmaka. Izbroj riječi; red može imati višestruke, vodeće i završne razmake ili biti prazan.",
    "inputFormat": "Jedan red malih slova a–z i običnih razmaka.",
    "outputFormat": "Broj riječi. Ograničenja: red do 10⁴ znakova.",
    "constraints": "red do 10⁴ znakova.",
    "concepts": [
      "Cijeli red",
      "Razmaci",
      "Prazan red ima nula riječi."
    ],
    "sampleTests": [
      {
        "input": "ucimo programiranje danas\n",
        "output": "3\n"
      },
      {
        "input": "  jedan   dva  \n",
        "output": "2\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-8",
      "Stringovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-rle",
    "grade": 8,
    "title": "Sažimanje uzastopnih slova",
    "category": "Stringovi",
    "difficulty": 3,
    "statement": "Svaki uzastopni blok jednakih slova zamijeni zapisom slovo:broj. Blokove odvoji razmakom.",
    "inputFormat": "Jedna neprazna riječ od slova a–z.",
    "outputFormat": "Blokovi, npr. a:3 b:2. Ograničenja: do 10⁴ slova.",
    "constraints": "do 10⁴ slova.",
    "concepts": [
      "Uzastopni blokovi",
      "Petlja",
      "Isto slovo kasnije može činiti novi blok."
    ],
    "sampleTests": [
      {
        "input": "aaabbc\n",
        "output": "a:3 b:2 c:1\n"
      },
      {
        "input": "ababa\n",
        "output": "a:1 b:1 a:1 b:1 a:1\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-8",
      "Stringovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-binarni-decimalni",
    "grade": 8,
    "title": "Iz binarnog u decimalni sistem",
    "category": "Brojevni sistemi",
    "difficulty": 2,
    "statement": "Pretvori binarni zapis u decimalni broj. Vodeće nule su dozvoljene.",
    "inputFormat": "Jedan niz znakova 0 i 1.",
    "outputFormat": "Decimalni broj. Ograničenja: od 1 do 30 binarnih cifara.",
    "constraints": "od 1 do 30 binarnih cifara.",
    "concepts": [
      "Pozicioni sistem",
      "Hornerov postupak",
      "Svaki novi bit: n=2n+bit."
    ],
    "sampleTests": [
      {
        "input": "1011\n",
        "output": "11\n"
      },
      {
        "input": "00101\n",
        "output": "5\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-8",
      "Brojevni sistemi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-decimalni-baza",
    "grade": 8,
    "title": "Decimalni broj u bazu 2–16",
    "category": "Brojevni sistemi",
    "difficulty": 3,
    "statement": "Pretvori n u bazu b. Za cifre veće od 9 koristi velika slova A–F. Nula se zapisuje kao 0.",
    "inputFormat": "Jedan red: n b.",
    "outputFormat": "Zapis bez vodećih nula. Ograničenja: 0 ≤ n ≤ 10¹²; 2 ≤ b ≤ 16.",
    "constraints": "0 ≤ n ≤ 10¹²; 2 ≤ b ≤ 16.",
    "concepts": [
      "Dijeljenje s ostatkom",
      "Baze",
      "Ostatke pročitaj obrnutim redom."
    ],
    "sampleTests": [
      {
        "input": "255 16\n",
        "output": "FF\n"
      },
      {
        "input": "83 8\n",
        "output": "123\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-8",
      "Brojevni sistemi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-zagrade",
    "grade": 8,
    "title": "Ispravno uparene zagrade",
    "category": "Stringovi",
    "difficulty": 3,
    "statement": "Niz se sastoji samo od ( i ). Ispiši DA ako je svaka otvorena zagrada ispravno zatvorena, inače NE. Prazan niz je ispravan.",
    "inputFormat": "Jedan red zagrada, koji može biti prazan.",
    "outputFormat": "DA ili NE. Ograničenja: do 10⁴ zagrada.",
    "constraints": "do 10⁴ zagrada.",
    "concepts": [
      "Bilans",
      "Redoslijed",
      "Bilans ne smije postati negativan."
    ],
    "sampleTests": [
      {
        "input": "(())()\n",
        "output": "DA\n"
      },
      {
        "input": "())(\n",
        "output": "NE\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-8",
      "Stringovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-anagram",
    "grade": 8,
    "title": "Dvije riječi — isti skup slova?",
    "category": "Stringovi",
    "difficulty": 2,
    "statement": "Riječi su anagrami ako svako slovo imaju isti broj puta. Ispiši DA ili NE.",
    "inputFormat": "Dva reda, svaki jedna neprazna riječ od slova a–z.",
    "outputFormat": "DA ili NE. Ograničenja: svaka riječ do 10⁴ znakova.",
    "constraints": "svaka riječ do 10⁴ znakova.",
    "concepts": [
      "Brojanje slova",
      "Sortiranje",
      "Broj ponavljanja je važan."
    ],
    "sampleTests": [
      {
        "input": "slika\nklisa\n",
        "output": "DA\n"
      },
      {
        "input": "ana\nan\n",
        "output": "NE\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-8",
      "Stringovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-spajanje",
    "grade": 8,
    "title": "Spoji dva uređena niza",
    "category": "Pretraga i sortiranje",
    "difficulty": 3,
    "statement": "Spoji dva neopadajuće uređena niza u jedan neopadajući niz. Zadrži sva ponavljanja.",
    "inputFormat": "Prvi red n m; drugi red n brojeva; treći red m brojeva. Prazan niz ima prazan red.",
    "outputFormat": "Uređeni spojeni niz; ako su oba prazna, prazan red. Ograničenja: 0 ≤ n,m ≤ 10⁴; |element| ≤ 10⁹.",
    "constraints": "0 ≤ n,m ≤ 10⁴; |element| ≤ 10⁹.",
    "concepts": [
      "Dva pokazivača",
      "Prazni nizovi",
      "Manji sljedeći element prelazi u izlaz."
    ],
    "sampleTests": [
      {
        "input": "3 4\n1 4 8\n2 4 6 9\n",
        "output": "1 2 4 4 6 8 9\n"
      },
      {
        "input": "1 1\n5\n5\n",
        "output": "5 5\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-8",
      "Pretraga i sortiranje"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-binarna-pretraga",
    "grade": 8,
    "title": "Prvi položaj u uređenom nizu",
    "category": "Pretraga i sortiranje",
    "difficulty": 3,
    "statement": "Za svaki upit x ispiši položaj prvog pojavljivanja x u uređenom nizu, ili 0 ako ga nema. Položaji počinju od 1.",
    "inputFormat": "Prvi red n q; drugi red n uređenih brojeva; treći red q upita.",
    "outputFormat": "Za svaki upit položaj u posebnom redu. Ograničenja: 0 ≤ n ≤ 10⁴; 1 ≤ q ≤ 10⁴; |broj| ≤ 10⁹.",
    "constraints": "0 ≤ n ≤ 10⁴; 1 ≤ q ≤ 10⁴; |broj| ≤ 10⁹.",
    "concepts": [
      "Binarna pretraga",
      "Prvi položaj",
      "Koristi lijevu granicu."
    ],
    "sampleTests": [
      {
        "input": "5 4\n1 3 3 7 9\n3 4 1 9\n",
        "output": "2\n0\n1\n5\n"
      },
      {
        "input": "1 3\n0\n0 -1 1\n",
        "output": "1\n0\n0\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-8",
      "Pretraga i sortiranje"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-dubina-zagrada",
    "grade": 8,
    "title": "Dubina ugniježđenih zagrada",
    "category": "Stringovi",
    "difficulty": 3,
    "statement": "Za ispravan niz zagrada ispiši najveći broj istovremeno otvorenih zagrada. Za neispravan niz ispiši −1. Prazan niz ima dubinu 0.",
    "inputFormat": "Jedan red znakova ( i ), koji može biti prazan.",
    "outputFormat": "Dubina ili −1. Ograničenja: do 10⁴ znakova.",
    "constraints": "do 10⁴ znakova.",
    "concepts": [
      "Bilans",
      "Maksimum",
      "Provjeri ispravnost prije konačnog rezultata."
    ],
    "sampleTests": [
      {
        "input": "(()(()))\n",
        "output": "3\n"
      },
      {
        "input": "()()\n",
        "output": "1\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-8",
      "Stringovi"
    ],
    "enrichment": false,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-bfs",
    "grade": 9,
    "title": "Najkraći put bez težina",
    "category": "Grafovi",
    "difficulty": 4,
    "statement": "U neusmjerenom grafu nađi najmanji broj grana od s do t. Ako put ne postoji, ispiši −1. Vrhovi su 1…n.",
    "inputFormat": "Prvi red n m s t; zatim m redova u v.",
    "outputFormat": "Dužina najkraćeg puta ili −1. Ograničenja: 1 ≤ n ≤ 2000; 0 ≤ m ≤ 10000; 1 ≤ u,v,s,t ≤ n.",
    "constraints": "1 ≤ n ≤ 2000; 0 ≤ m ≤ 10000; 1 ≤ u,v,s,t ≤ n.",
    "concepts": [
      "Graf",
      "BFS",
      "Red održava redoslijed udaljenosti."
    ],
    "sampleTests": [
      {
        "input": "4 4 1 4\n1 2\n2 4\n1 3\n3 4\n",
        "output": "2\n"
      },
      {
        "input": "4 2 1 4\n1 2\n3 4\n",
        "output": "-1\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-9",
      "Grafovi"
    ],
    "enrichment": true,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-komponente",
    "grade": 9,
    "title": "Povezane komponente grafa",
    "category": "Grafovi",
    "difficulty": 4,
    "statement": "Izbroj povezane komponente neusmjerenog grafa. Izolovan vrh čini jednu komponentu.",
    "inputFormat": "Prvi red n m; zatim m redova u v.",
    "outputFormat": "Broj komponenti. Ograničenja: 1 ≤ n ≤ 2000; 0 ≤ m ≤ 10000.",
    "constraints": "1 ≤ n ≤ 2000; 0 ≤ m ≤ 10000.",
    "concepts": [
      "DFS ili BFS",
      "Posjećenost",
      "Pokreni obilazak iz svakog neposjećenog vrha."
    ],
    "sampleTests": [
      {
        "input": "5 2\n1 2\n3 4\n",
        "output": "3\n"
      },
      {
        "input": "3 2\n1 2\n2 3\n",
        "output": "1\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-9",
      "Grafovi"
    ],
    "enrichment": true,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-dijkstra",
    "grade": 9,
    "title": "Najjeftinija ruta",
    "category": "Grafovi",
    "difficulty": 5,
    "statement": "U neusmjerenom grafu s nenegativnim težinama nađi najmanji zbir težina od s do t. Za nedostižan cilj ispiši −1.",
    "inputFormat": "Prvi red n m s t; zatim m redova u v težina.",
    "outputFormat": "Minimalna cijena ili −1. Ograničenja: 1 ≤ n ≤ 2000; 0 ≤ m ≤ 10000; 0 ≤ težina ≤ 10¹⁰.",
    "constraints": "1 ≤ n ≤ 2000; 0 ≤ m ≤ 10000; 0 ≤ težina ≤ 10¹⁰.",
    "concepts": [
      "Prioritetni red",
      "Nenegativne težine",
      "Preskoči zastarjeli zapis udaljenosti."
    ],
    "sampleTests": [
      {
        "input": "4 4 1 4\n1 2 3\n2 4 4\n1 3 10\n3 4 1\n",
        "output": "7\n"
      },
      {
        "input": "3 1 1 3\n1 2 5\n",
        "output": "-1\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-9",
      "Grafovi"
    ],
    "enrichment": true,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-raspored",
    "grade": 9,
    "title": "Najviše termina bez preklapanja",
    "category": "Pohlepni algoritmi",
    "difficulty": 4,
    "statement": "Izaberi najveći broj termina koji se ne preklapaju. Termin koji počinje tačno kad prethodni završava je dozvoljen.",
    "inputFormat": "Prvi red n; zatim n redova početak kraj, početak < kraj.",
    "outputFormat": "Najveći broj izabranih termina. Ograničenja: 0 ≤ n ≤ 10⁴; vremena od −10⁹ do 10⁹.",
    "constraints": "0 ≤ n ≤ 10⁴; vremena od −10⁹ do 10⁹.",
    "concepts": [
      "Sortiraj po završetku",
      "Pohlepni izbor",
      "Granica završetka može biti jednaka novom početku."
    ],
    "sampleTests": [
      {
        "input": "4\n1 3\n2 4\n3 5\n5 8\n",
        "output": "3\n"
      },
      {
        "input": "3\n0 2\n2 4\n4 6\n",
        "output": "3\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-9",
      "Pohlepni algoritmi"
    ],
    "enrichment": true,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-kovanice",
    "grade": 9,
    "title": "Najmanje kovanica za iznos",
    "category": "Dinamičko programiranje",
    "difficulty": 4,
    "statement": "Za zadate vrijednosti kovanica nađi najmanji broj kovanica za tačan iznos S. Svaka vrijednost dostupna je neograničeno. Ako nije moguće, ispiši −1.",
    "inputFormat": "Prvi red n S; drugi red n vrijednosti.",
    "outputFormat": "Najmanji broj kovanica ili −1. Ograničenja: 1 ≤ n ≤ 30; 0 ≤ S ≤ 10000; 1 ≤ vrijednost ≤ 10000.",
    "constraints": "1 ≤ n ≤ 30; 0 ≤ S ≤ 10000; 1 ≤ vrijednost ≤ 10000.",
    "concepts": [
      "Stanje dp[x]",
      "Pohlepni izbor nije uvijek dovoljan."
    ],
    "sampleTests": [
      {
        "input": "3 11\n1 5 7\n",
        "output": "3\n"
      },
      {
        "input": "2 3\n2 4\n",
        "output": "-1\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-9",
      "Dinamičko programiranje"
    ],
    "enrichment": true,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-lis",
    "grade": 9,
    "title": "Najduži rastući podniz",
    "category": "Dinamičko programiranje",
    "difficulty": 5,
    "statement": "Izaberi što više elemenata u izvornom redoslijedu tako da vrijednosti strogo rastu. Izabrani elementi ne moraju biti susjedni.",
    "inputFormat": "Prvi red n; drugi red n brojeva.",
    "outputFormat": "Dužina najdužeg strogo rastućeg podniza. Ograničenja: 0 ≤ n ≤ 2000; |aᵢ| ≤ 10⁹.",
    "constraints": "0 ≤ n ≤ 2000; |aᵢ| ≤ 10⁹.",
    "concepts": [
      "Podniz",
      "Strogo rastuće",
      "Jednak broj ne produžava podniz."
    ],
    "sampleTests": [
      {
        "input": "5\n3 1 2 5 4\n",
        "output": "3\n"
      },
      {
        "input": "4\n5 4 3 2\n",
        "output": "1\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-9",
      "Dinamičko programiranje"
    ],
    "enrichment": true,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-ruksak",
    "grade": 9,
    "title": "Ruksak — svaki predmet jednom",
    "category": "Dinamičko programiranje",
    "difficulty": 5,
    "statement": "Odaberi predmete ukupne težine najviše W tako da zbir vrijednosti bude najveći. Svaki predmet možeš uzeti najviše jednom.",
    "inputFormat": "Prvi red n W; zatim n redova težina vrijednost.",
    "outputFormat": "Najveća vrijednost. Ograničenja: 0 ≤ n ≤ 100; 0 ≤ W ≤ 10000; 1 ≤ težina ≤ 10000; 0 ≤ vrijednost ≤ 10⁶.",
    "constraints": "0 ≤ n ≤ 100; 0 ≤ W ≤ 10000; 1 ≤ težina ≤ 10000; 0 ≤ vrijednost ≤ 10⁶.",
    "concepts": [
      "0/1 ruksak",
      "Obrnuta petlja",
      "Kapacitet prolazi unazad da ne ponoviš predmet."
    ],
    "sampleTests": [
      {
        "input": "3 5\n2 3\n3 4\n4 5\n",
        "output": "7\n"
      },
      {
        "input": "2 1\n2 9\n3 10\n",
        "output": "0\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-9",
      "Dinamičko programiranje"
    ],
    "enrichment": true,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-sito",
    "grade": 9,
    "title": "Eratostenovo sito",
    "category": "Teorija brojeva",
    "difficulty": 3,
    "statement": "Ispiši sve proste brojeve od 2 do n u rastućem poretku. Ako nema nijednog, ispiši znak -.",
    "inputFormat": "Jedan cijeli broj n.",
    "outputFormat": "Prosti brojevi ili -. Ograničenja: 0 ≤ n ≤ 100000.",
    "constraints": "0 ≤ n ≤ 100000.",
    "concepts": [
      "Sito",
      "Višekratnici",
      "Počni označavanje od d²."
    ],
    "sampleTests": [
      {
        "input": "20\n",
        "output": "2 3 5 7 11 13 17 19\n"
      },
      {
        "input": "5\n",
        "output": "2 3 5\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-9",
      "Teorija brojeva"
    ],
    "enrichment": true,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-segment-zbir",
    "grade": 9,
    "title": "Koliko segmenata ima zadati zbir?",
    "category": "Dva pokazivača",
    "difficulty": 4,
    "statement": "Niz sadrži samo pozitivne brojeve. Izbroj neprazne uzastopne segmente čiji je zbir tačno S.",
    "inputFormat": "Prvi red n S; drugi red n pozitivnih brojeva.",
    "outputFormat": "Broj segmenata. Ograničenja: 1 ≤ n ≤ 10⁴; 1 ≤ S ≤ 10⁹; 1 ≤ aᵢ ≤ 10⁹.",
    "constraints": "1 ≤ n ≤ 10⁴; 1 ≤ S ≤ 10⁹; 1 ≤ aᵢ ≤ 10⁹.",
    "concepts": [
      "Klizni prozor",
      "Pozitivni brojevi",
      "Povećanje lijeve granice smanjuje zbir."
    ],
    "sampleTests": [
      {
        "input": "5 5\n1 2 3 2 3\n",
        "output": "3\n"
      },
      {
        "input": "3 7\n1 1 1\n",
        "output": "0\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-9",
      "Dva pokazivača"
    ],
    "enrichment": true,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-putanje-mreza",
    "grade": 9,
    "title": "Putanje kroz mrežu s preprekama",
    "category": "Dinamičko programiranje",
    "difficulty": 4,
    "statement": "Iz gornjeg lijevog polja do donjeg desnog kreći se samo desno ili dolje. Tačka je slobodno polje, # prepreka. Prebroj putanje modulo 1000000007.",
    "inputFormat": "Prvi red r c; zatim r redova od po c znakova . ili #.",
    "outputFormat": "Broj putanja modulo 1000000007. Ograničenja: 1 ≤ r,c ≤ 200.",
    "constraints": "1 ≤ r,c ≤ 200.",
    "concepts": [
      "Brojanje putanja",
      "Prepreke",
      "Prepreka ima nula dolaznih putanja."
    ],
    "sampleTests": [
      {
        "input": "3 3\n...\n.#.\n...\n",
        "output": "2\n"
      },
      {
        "input": "2 2\n..\n..\n",
        "output": "2\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-9",
      "Dinamičko programiranje"
    ],
    "enrichment": true,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  },
  {
    "id": "pa-topoloski",
    "grade": 9,
    "title": "Redoslijed poslova s preduslovima",
    "category": "Grafovi",
    "difficulty": 5,
    "statement": "Usmjerena grana u→v znači da posao u mora prethoditi poslu v. Ispiši leksikografski najmanji topološki poredak: svaki put izaberi najmanji raspoloživi broj. Ako postoji ciklus, ispiši CIKLUS.",
    "inputFormat": "Prvi red n m; zatim m redova u v.",
    "outputFormat": "Poredak svih vrhova ili CIKLUS. Ograničenja: 1 ≤ n ≤ 2000; 0 ≤ m ≤ 10000.",
    "constraints": "1 ≤ n ≤ 2000; 0 ≤ m ≤ 10000.",
    "concepts": [
      "Usmjereni graf",
      "Ulazni stepen",
      "Prioritetni red daje jedinstven najmanji poredak."
    ],
    "sampleTests": [
      {
        "input": "4 3\n1 3\n2 3\n3 4\n",
        "output": "1 2 3 4\n"
      },
      {
        "input": "3 3\n1 2\n2 3\n3 1\n",
        "output": "CIKLUS\n"
      }
    ],
    "testCount": 8,
    "lessonKeys": [
      "informatics-9",
      "Grafovi"
    ],
    "enrichment": true,
    "starters": {
      "python": "import sys\n\ndef solve():\n    data = sys.stdin.read()\n    # Pročitaj ulaz, izračunaj i ispiši samo traženi rezultat.\n    pass\n\nsolve()\n",
      "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main(void) {\n    /* Pročitaj ulaz i ispiši rezultat; koristi long long za velike brojeve. */\n    return 0;\n}\n",
      "cpp": "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <queue>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    // Pročitaj ulaz i ispiši traženi rezultat.\n    return 0;\n}\n",
      "java": "import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Scanner in = new Scanner(System.in);\n        // Pročitaj ulaz i ispiši traženi rezultat.\n    }\n}\n"
    }
  }
];if(typeof module==='object'&&module.exports)module.exports=tasks;else root.ELDI_PROGRAM_ASSESSMENTS=tasks;})(typeof globalThis!=='undefined'?globalThis:this);
