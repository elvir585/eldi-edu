'use strict';
/* Privatni testovi i izvorna referentna rješenja; ne učitava se u renderer. */
module.exports={
  "pa-zbir": {
    "tests": [
      {
        "input": "7 5\n",
        "output": "12\n"
      },
      {
        "input": "-4 9\n",
        "output": "5\n"
      },
      {
        "input": "0 0\n",
        "output": "0\n"
      },
      {
        "input": "1000000000 1000000000\n",
        "output": "2000000000\n"
      },
      {
        "input": "-1000000000 -1000000000\n",
        "output": "-2000000000\n"
      },
      {
        "input": "83 -83\n",
        "output": "0\n"
      },
      {
        "input": "-1 0\n",
        "output": "-1\n"
      },
      {
        "input": "999999999 -1000000000\n",
        "output": "-1\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\na,b=map(int,input().split()); print(a+b)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long a,b;cin>>a>>b;cout<<a+b;\nreturn 0;}\n"
    }
  },
  "pa-razlika": {
    "tests": [
      {
        "input": "8 17\n",
        "output": "9\n"
      },
      {
        "input": "5 -3\n",
        "output": "-8\n"
      },
      {
        "input": "0 0\n",
        "output": "0\n"
      },
      {
        "input": "-100 100\n",
        "output": "200\n"
      },
      {
        "input": "100 -100\n",
        "output": "-200\n"
      },
      {
        "input": "-8 -2\n",
        "output": "6\n"
      },
      {
        "input": "-1 0\n",
        "output": "1\n"
      },
      {
        "input": "100 100\n",
        "output": "0\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\na,b=map(int,input().split()); print(b-a)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long a,b;cin>>a>>b;cout<<b-a;\nreturn 0;}\n"
    }
  },
  "pa-proizvod": {
    "tests": [
      {
        "input": "12 24\n",
        "output": "288\n"
      },
      {
        "input": "1 8\n",
        "output": "8\n"
      },
      {
        "input": "0 7\n",
        "output": "0\n"
      },
      {
        "input": "1000000 1000000\n",
        "output": "1000000000000\n"
      },
      {
        "input": "7 0\n",
        "output": "0\n"
      },
      {
        "input": "999 999\n",
        "output": "998001\n"
      },
      {
        "input": "1 1000000\n",
        "output": "1000000\n"
      },
      {
        "input": "73 91\n",
        "output": "6643\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nr,s=map(int,input().split()); print(r*s)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long r,s;cin>>r>>s;cout<<r*s;\nreturn 0;}\n"
    }
  },
  "pa-podjela": {
    "tests": [
      {
        "input": "23 5\n",
        "output": "4 3\n"
      },
      {
        "input": "24 6\n",
        "output": "4 0\n"
      },
      {
        "input": "0 3\n",
        "output": "0 0\n"
      },
      {
        "input": "7 20\n",
        "output": "0 7\n"
      },
      {
        "input": "1000000000 1\n",
        "output": "1000000000 0\n"
      },
      {
        "input": "1000000000 999999\n",
        "output": "1000 1000\n"
      },
      {
        "input": "1 1\n",
        "output": "1 0\n"
      },
      {
        "input": "999999999 1000000\n",
        "output": "999 999999\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn,k=map(int,input().split()); print(n//k,n%k)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n,k;cin>>n>>k;cout<<n/k<<\" \"<<n%k;\nreturn 0;}\n"
    }
  },
  "pa-max-tri": {
    "tests": [
      {
        "input": "3 9 5\n",
        "output": "9\n"
      },
      {
        "input": "8 8 1\n",
        "output": "8\n"
      },
      {
        "input": "-7 -2 -9\n",
        "output": "-2\n"
      },
      {
        "input": "0 0 0\n",
        "output": "0\n"
      },
      {
        "input": "1000000000 -1000000000 2\n",
        "output": "1000000000\n"
      },
      {
        "input": "4 4 4\n",
        "output": "4\n"
      },
      {
        "input": "-1000000000 -1000000000 -1000000000\n",
        "output": "-1000000000\n"
      },
      {
        "input": "-1 0 -1\n",
        "output": "0\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nprint(max(map(int,input().split())))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long a,b,c;cin>>a>>b>>c;cout<<max(a,max(b,c));\nreturn 0;}\n"
    }
  },
  "pa-sort-tri": {
    "tests": [
      {
        "input": "8 2 5\n",
        "output": "2 5 8\n"
      },
      {
        "input": "4 4 1\n",
        "output": "1 4 4\n"
      },
      {
        "input": "-1 -9 -3\n",
        "output": "-9 -3 -1\n"
      },
      {
        "input": "0 0 0\n",
        "output": "0 0 0\n"
      },
      {
        "input": "1000000000 -1000000000 0\n",
        "output": "-1000000000 0 1000000000\n"
      },
      {
        "input": "1 2 3\n",
        "output": "1 2 3\n"
      },
      {
        "input": "3 2 1\n",
        "output": "1 2 3\n"
      },
      {
        "input": "5 -5 5\n",
        "output": "-5 5 5\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nprint(*sorted(map(int,input().split())))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nvector<long long>a(3);for(auto&x:a)cin>>x;sort(a.begin(),a.end());for(auto x:a)cout<<x<<\" \";\nreturn 0;}\n"
    }
  },
  "pa-pravougaonik": {
    "tests": [
      {
        "input": "3 5\n",
        "output": "16 15\n"
      },
      {
        "input": "4 4\n",
        "output": "16 16\n"
      },
      {
        "input": "1 1\n",
        "output": "4 1\n"
      },
      {
        "input": "1000000 1000000\n",
        "output": "4000000 1000000000000\n"
      },
      {
        "input": "1 1000000\n",
        "output": "2000002 1000000\n"
      },
      {
        "input": "27 13\n",
        "output": "80 351\n"
      },
      {
        "input": "12345 67890\n",
        "output": "160470 838102050\n"
      },
      {
        "input": "2 1\n",
        "output": "6 2\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\na,b=map(int,input().split()); print(2*(a+b),a*b)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long a,b;cin>>a>>b;cout<<2*(a+b)<<\" \"<<a*b;\nreturn 0;}\n"
    }
  },
  "pa-trajanje": {
    "tests": [
      {
        "input": "3661\n",
        "output": "1 1 1\n"
      },
      {
        "input": "125\n",
        "output": "0 2 5\n"
      },
      {
        "input": "0\n",
        "output": "0 0 0\n"
      },
      {
        "input": "3600\n",
        "output": "1 0 0\n"
      },
      {
        "input": "1000000000\n",
        "output": "277777 46 40\n"
      },
      {
        "input": "86399\n",
        "output": "23 59 59\n"
      },
      {
        "input": "59\n",
        "output": "0 0 59\n"
      },
      {
        "input": "60\n",
        "output": "0 1 0\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); print(n//3600,n%3600//60,n%60)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;cout<<n/3600<<\" \"<<(n%3600)/60<<\" \"<<n%60;\nreturn 0;}\n"
    }
  },
  "pa-racun": {
    "tests": [
      {
        "input": "250 3 1000\n",
        "output": "250\n"
      },
      {
        "input": "150 2 200\n",
        "output": "NEDOVOLJNO\n"
      },
      {
        "input": "0 0 0\n",
        "output": "0\n"
      },
      {
        "input": "1000000 1000000 1000000000000\n",
        "output": "0\n"
      },
      {
        "input": "5 0 7\n",
        "output": "7\n"
      },
      {
        "input": "9 8 71\n",
        "output": "NEDOVOLJNO\n"
      },
      {
        "input": "7 9 63\n",
        "output": "0\n"
      },
      {
        "input": "1 1000000 999999\n",
        "output": "NEDOVOLJNO\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nc,k,p=map(int,input().split()); print(p-c*k if p>=c*k else \"NEDOVOLJNO\")\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long c,k,p;cin>>c>>k>>p;if(p>=c*k)cout<<p-c*k;else cout<<\"NEDOVOLJNO\";\nreturn 0;}\n"
    }
  },
  "pa-zadnja-cifra": {
    "tests": [
      {
        "input": "1234\n",
        "output": "4\n"
      },
      {
        "input": "-567\n",
        "output": "7\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      },
      {
        "input": "1000000000000\n",
        "output": "0\n"
      },
      {
        "input": "-1\n",
        "output": "1\n"
      },
      {
        "input": "890\n",
        "output": "0\n"
      },
      {
        "input": "-1000000000000\n",
        "output": "0\n"
      },
      {
        "input": "999999999999\n",
        "output": "9\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nprint(abs(int(input()))%10)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;cout<<llabs(n)%10;\nreturn 0;}\n"
    }
  },
  "pa-zbir-cifara": {
    "tests": [
      {
        "input": "5092\n",
        "output": "16\n"
      },
      {
        "input": "-123\n",
        "output": "6\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      },
      {
        "input": "999999999999\n",
        "output": "108\n"
      },
      {
        "input": "1000000000000\n",
        "output": "1\n"
      },
      {
        "input": "-909090\n",
        "output": "27\n"
      },
      {
        "input": "10\n",
        "output": "1\n"
      },
      {
        "input": "-1000000000000\n",
        "output": "1\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=abs(int(input())); print(sum(map(int,str(n))))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;n=llabs(n);int s=0;while(n){s+=n%10;n/=10;}cout<<s;\nreturn 0;}\n"
    }
  },
  "pa-parnost": {
    "tests": [
      {
        "input": "12\n",
        "output": "PARAN\n"
      },
      {
        "input": "7\n",
        "output": "NEPARAN\n"
      },
      {
        "input": "0\n",
        "output": "PARAN\n"
      },
      {
        "input": "-8\n",
        "output": "PARAN\n"
      },
      {
        "input": "-9\n",
        "output": "NEPARAN\n"
      },
      {
        "input": "1000000000\n",
        "output": "PARAN\n"
      },
      {
        "input": "1\n",
        "output": "NEPARAN\n"
      },
      {
        "input": "-1000000000\n",
        "output": "PARAN\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nprint(\"PARAN\" if int(input())%2==0 else \"NEPARAN\")\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;cout<<(n%2==0?\"PARAN\":\"NEPARAN\");\nreturn 0;}\n"
    }
  },
  "pa-djeljivost": {
    "tests": [
      {
        "input": "144 9\n",
        "output": "DA\n"
      },
      {
        "input": "26 25\n",
        "output": "NE\n"
      },
      {
        "input": "0 15\n",
        "output": "DA\n"
      },
      {
        "input": "1000000000000 25\n",
        "output": "DA\n"
      },
      {
        "input": "78 6\n",
        "output": "DA\n"
      },
      {
        "input": "19 4\n",
        "output": "NE\n"
      },
      {
        "input": "105 15\n",
        "output": "DA\n"
      },
      {
        "input": "1230 10\n",
        "output": "DA\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn,d=map(int,input().split()); print(\"DA\" if n%d==0 else \"NE\")\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n,d;cin>>n>>d;cout<<(n%d==0?\"DA\":\"NE\");\nreturn 0;}\n"
    }
  },
  "pa-nzd": {
    "tests": [
      {
        "input": "18 24\n",
        "output": "6\n"
      },
      {
        "input": "17 13\n",
        "output": "1\n"
      },
      {
        "input": "0 19\n",
        "output": "19\n"
      },
      {
        "input": "21 0\n",
        "output": "21\n"
      },
      {
        "input": "1000000000 250000000\n",
        "output": "250000000\n"
      },
      {
        "input": "81 81\n",
        "output": "81\n"
      },
      {
        "input": "999999937 1000000000\n",
        "output": "1\n"
      },
      {
        "input": "1 1000000000\n",
        "output": "1\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\na,b=map(int,input().split()); print(math.gcd(a,b))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long a,b;cin>>a>>b;cout<<gcd(a,b);\nreturn 0;}\n"
    }
  },
  "pa-nzs": {
    "tests": [
      {
        "input": "6 8\n",
        "output": "24\n"
      },
      {
        "input": "5 7\n",
        "output": "35\n"
      },
      {
        "input": "1 1\n",
        "output": "1\n"
      },
      {
        "input": "1000000 999999\n",
        "output": "999999000000\n"
      },
      {
        "input": "81 27\n",
        "output": "81\n"
      },
      {
        "input": "14 14\n",
        "output": "14\n"
      },
      {
        "input": "999983 999979\n",
        "output": "999962000357\n"
      },
      {
        "input": "1 1000000\n",
        "output": "1000000\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\na,b=map(int,input().split()); print(a//math.gcd(a,b)*b)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long a,b;cin>>a>>b;cout<<a/gcd(a,b)*b;\nreturn 0;}\n"
    }
  },
  "pa-prost": {
    "tests": [
      {
        "input": "17\n",
        "output": "PROST\n"
      },
      {
        "input": "25\n",
        "output": "NIJE PROST\n"
      },
      {
        "input": "0\n",
        "output": "NIJE PROST\n"
      },
      {
        "input": "1\n",
        "output": "NIJE PROST\n"
      },
      {
        "input": "2\n",
        "output": "PROST\n"
      },
      {
        "input": "999983\n",
        "output": "PROST\n"
      },
      {
        "input": "999950884\n",
        "output": "NIJE PROST\n"
      },
      {
        "input": "1000000000\n",
        "output": "NIJE PROST\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); ok=n>=2\nfor d in range(2,math.isqrt(n)+1):\n    if n%d==0: ok=False; break\nprint(\"PROST\" if ok else \"NIJE PROST\")\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;bool ok=n>=2;for(long long d=2;d*d<=n;d++)if(n%d==0){ok=false;break;}cout<<(ok?\"PROST\":\"NIJE PROST\");\nreturn 0;}\n"
    }
  },
  "pa-broj-djelilaca": {
    "tests": [
      {
        "input": "12\n",
        "output": "6\n"
      },
      {
        "input": "16\n",
        "output": "5\n"
      },
      {
        "input": "1\n",
        "output": "1\n"
      },
      {
        "input": "999983\n",
        "output": "2\n"
      },
      {
        "input": "1000000000\n",
        "output": "100\n"
      },
      {
        "input": "49\n",
        "output": "3\n"
      },
      {
        "input": "36\n",
        "output": "9\n"
      },
      {
        "input": "999950884\n",
        "output": "27\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); total=0\nfor d in range(1,math.isqrt(n)+1):\n    if n%d==0: total+=1 if d*d==n else 2\nprint(total)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;int ans=0;for(long long d=1;d*d<=n;d++)if(n%d==0)ans+=(d*d==n?1:2);cout<<ans;\nreturn 0;}\n"
    }
  },
  "pa-skrati-razlomak": {
    "tests": [
      {
        "input": "18 24\n",
        "output": "3 4\n"
      },
      {
        "input": "-6 9\n",
        "output": "-2 3\n"
      },
      {
        "input": "0 17\n",
        "output": "0 1\n"
      },
      {
        "input": "1 999983\n",
        "output": "1 999983\n"
      },
      {
        "input": "1000000000 1000000000\n",
        "output": "1 1\n"
      },
      {
        "input": "-21 7\n",
        "output": "-3 1\n"
      },
      {
        "input": "-1000000000 2\n",
        "output": "-500000000 1\n"
      },
      {
        "input": "999983 999979\n",
        "output": "999983 999979\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\na,b=map(int,input().split()); g=math.gcd(a,b); print(a//g,b//g)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long a,b;cin>>a>>b;long long g=gcd(llabs(a),b);cout<<a/g<<\" \"<<b/g;\nreturn 0;}\n"
    }
  },
  "pa-prestupna": {
    "tests": [
      {
        "input": "2024\n",
        "output": "DA\n"
      },
      {
        "input": "2023\n",
        "output": "NE\n"
      },
      {
        "input": "1900\n",
        "output": "NE\n"
      },
      {
        "input": "2000\n",
        "output": "DA\n"
      },
      {
        "input": "1\n",
        "output": "NE\n"
      },
      {
        "input": "2400\n",
        "output": "DA\n"
      },
      {
        "input": "2100\n",
        "output": "NE\n"
      },
      {
        "input": "9996\n",
        "output": "DA\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\ng=int(input()); print(\"DA\" if g%400==0 or (g%4==0 and g%100!=0) else \"NE\")\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint g;cin>>g;cout<<((g%400==0||(g%4==0&&g%100!=0))?\"DA\":\"NE\");\nreturn 0;}\n"
    }
  },
  "pa-zbir-do-n": {
    "tests": [
      {
        "input": "5\n",
        "output": "15\n"
      },
      {
        "input": "10\n",
        "output": "55\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      },
      {
        "input": "1\n",
        "output": "1\n"
      },
      {
        "input": "1000000000\n",
        "output": "500000000500000000\n"
      },
      {
        "input": "999999999\n",
        "output": "499999999500000000\n"
      },
      {
        "input": "2\n",
        "output": "3\n"
      },
      {
        "input": "1234567\n",
        "output": "762078456028\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); print(n*(n+1)//2)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;cout<<n*(n+1)/2;\nreturn 0;}\n"
    }
  },
  "pa-zbir-interval": {
    "tests": [
      {
        "input": "3 7\n",
        "output": "25\n"
      },
      {
        "input": "-3 2\n",
        "output": "-3\n"
      },
      {
        "input": "0 0\n",
        "output": "0\n"
      },
      {
        "input": "-1000000 1000000\n",
        "output": "0\n"
      },
      {
        "input": "-9 -9\n",
        "output": "-9\n"
      },
      {
        "input": "1 1000000\n",
        "output": "500000500000\n"
      },
      {
        "input": "-1000000 -1\n",
        "output": "-500000500000\n"
      },
      {
        "input": "-5 5\n",
        "output": "0\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\na,b=map(int,input().split()); print((a+b)*(b-a+1)//2)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long a,b;cin>>a>>b;cout<<(a+b)*(b-a+1)/2;\nreturn 0;}\n"
    }
  },
  "pa-zbir-umnozaka": {
    "tests": [
      {
        "input": "4 3\n",
        "output": "30\n"
      },
      {
        "input": "3 -2\n",
        "output": "-12\n"
      },
      {
        "input": "0 7\n",
        "output": "0\n"
      },
      {
        "input": "1000000 1000000\n",
        "output": "500000500000000000\n"
      },
      {
        "input": "9 0\n",
        "output": "0\n"
      },
      {
        "input": "1 -1000000\n",
        "output": "-1000000\n"
      },
      {
        "input": "1000000 -1000000\n",
        "output": "-500000500000000000\n"
      },
      {
        "input": "1000000 1\n",
        "output": "500000500000\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn,k=map(int,input().split()); print(k*n*(n+1)//2)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n,k;cin>>n>>k;cout<<k*n*(n+1)/2;\nreturn 0;}\n"
    }
  },
  "pa-niz-zbir": {
    "tests": [
      {
        "input": "3\n4 1 7\n",
        "output": "12\n"
      },
      {
        "input": "4\n-5 9 -2 0\n",
        "output": "2\n"
      },
      {
        "input": "1\n0\n",
        "output": "0\n"
      },
      {
        "input": "2\n-1000000000 1000000000\n",
        "output": "0\n"
      },
      {
        "input": "4\n2 2 2 2\n",
        "output": "8\n"
      },
      {
        "input": "100\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100\n",
        "output": "5050\n"
      },
      {
        "input": "3\n-1 -1 -1\n",
        "output": "-3\n"
      },
      {
        "input": "4\n1000000000 1000000000 1000000000 1000000000\n",
        "output": "4000000000\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); a=list(map(int,sys.stdin.read().split())); print(sum(a))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;long long s=0,x;while(n--){cin>>x;s+=x;}cout<<s;\nreturn 0;}\n"
    }
  },
  "pa-prvi-maksimum": {
    "tests": [
      {
        "input": "3\n4 1 7\n",
        "output": "7 3\n"
      },
      {
        "input": "4\n-5 9 -2 0\n",
        "output": "9 2\n"
      },
      {
        "input": "1\n0\n",
        "output": "0 1\n"
      },
      {
        "input": "2\n-1000000000 1000000000\n",
        "output": "1000000000 2\n"
      },
      {
        "input": "4\n2 2 2 2\n",
        "output": "2 1\n"
      },
      {
        "input": "100\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100\n",
        "output": "100 100\n"
      },
      {
        "input": "3\n9 1 9\n",
        "output": "9 1\n"
      },
      {
        "input": "4\n-9 -9 -9 -8\n",
        "output": "-8 4\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); a=list(map(int,sys.stdin.read().split())); m=max(a); print(m,a.index(m)+1)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;long long x,m;int p=1;cin>>m;for(int i=2;i<=n;i++){cin>>x;if(x>m){m=x;p=i;}}cout<<m<<\" \"<<p;\nreturn 0;}\n"
    }
  },
  "pa-iznad-prosjeka": {
    "tests": [
      {
        "input": "3\n4 1 7\n",
        "output": "1\n"
      },
      {
        "input": "4\n-5 9 -2 0\n",
        "output": "1\n"
      },
      {
        "input": "1\n0\n",
        "output": "0\n"
      },
      {
        "input": "2\n-1000000000 1000000000\n",
        "output": "1\n"
      },
      {
        "input": "4\n2 2 2 2\n",
        "output": "0\n"
      },
      {
        "input": "100\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100\n",
        "output": "50\n"
      },
      {
        "input": "3\n-3 -2 -1\n",
        "output": "1\n"
      },
      {
        "input": "3\n1 1 2\n",
        "output": "1\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); a=list(map(int,sys.stdin.read().split())); s=sum(a); print(sum(x*n>s for x in a))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<long long>a(n);long long s=0;for(auto&x:a){cin>>x;s+=x;}int c=0;for(auto x:a)if(x*n>s)c++;cout<<c;\nreturn 0;}\n"
    }
  },
  "pa-predznaci": {
    "tests": [
      {
        "input": "3\n4 1 7\n",
        "output": "0 0 3\n"
      },
      {
        "input": "4\n-5 9 -2 0\n",
        "output": "2 1 1\n"
      },
      {
        "input": "1\n0\n",
        "output": "0 1 0\n"
      },
      {
        "input": "2\n-1000000000 1000000000\n",
        "output": "1 0 1\n"
      },
      {
        "input": "4\n2 2 2 2\n",
        "output": "0 0 4\n"
      },
      {
        "input": "100\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100\n",
        "output": "0 0 100\n"
      },
      {
        "input": "3\n-1 -2 -3\n",
        "output": "3 0 0\n"
      },
      {
        "input": "4\n0 0 0 0\n",
        "output": "0 4 0\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); a=list(map(int,sys.stdin.read().split())); print(sum(x<0 for x in a),a.count(0),sum(x>0 for x in a))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;int neg=0,z=0,pos=0;long long x;while(n--){cin>>x;if(x<0)neg++;else if(x==0)z++;else pos++;}cout<<neg<<\" \"<<z<<\" \"<<pos;\nreturn 0;}\n"
    }
  },
  "pa-obrni-niz": {
    "tests": [
      {
        "input": "3\n4 1 7\n",
        "output": "7 1 4\n"
      },
      {
        "input": "4\n-5 9 -2 0\n",
        "output": "0 -2 9 -5\n"
      },
      {
        "input": "1\n0\n",
        "output": "0\n"
      },
      {
        "input": "2\n-1000000000 1000000000\n",
        "output": "1000000000 -1000000000\n"
      },
      {
        "input": "4\n2 2 2 2\n",
        "output": "2 2 2 2\n"
      },
      {
        "input": "100\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100\n",
        "output": "100 99 98 97 96 95 94 93 92 91 90 89 88 87 86 85 84 83 82 81 80 79 78 77 76 75 74 73 72 71 70 69 68 67 66 65 64 63 62 61 60 59 58 57 56 55 54 53 52 51 50 49 48 47 46 45 44 43 42 41 40 39 38 37 36 35 34 33 32 31 30 29 28 27 26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1\n"
      },
      {
        "input": "3\n-1 -1 -2\n",
        "output": "-2 -1 -1\n"
      },
      {
        "input": "2\n9 0\n",
        "output": "0 9\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); a=list(map(int,sys.stdin.read().split())); print(*a[::-1])\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;for(int i=n-1;i>=0;i--)cout<<a[i]<<\" \";\nreturn 0;}\n"
    }
  },
  "pa-razliciti": {
    "tests": [
      {
        "input": "3\n4 1 7\n",
        "output": "3\n1 4 7\n"
      },
      {
        "input": "4\n-5 9 -2 0\n",
        "output": "4\n-5 -2 0 9\n"
      },
      {
        "input": "1\n0\n",
        "output": "1\n0\n"
      },
      {
        "input": "2\n-1000000000 1000000000\n",
        "output": "2\n-1000000000 1000000000\n"
      },
      {
        "input": "4\n2 2 2 2\n",
        "output": "1\n2\n"
      },
      {
        "input": "100\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100\n",
        "output": "100\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100\n"
      },
      {
        "input": "5\n8 2 8 2 8\n",
        "output": "2\n2 8\n"
      },
      {
        "input": "4\n-9 -9 0 -8\n",
        "output": "3\n-9 -8 0\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); a=sorted(set(map(int,sys.stdin.read().split()))); print(len(a)); print(*a)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;set<long long>s;long long x;while(n--){cin>>x;s.insert(x);}cout<<s.size()<<\"\\n\";for(auto x:s)cout<<x<<\" \";\nreturn 0;}\n"
    }
  },
  "pa-prefiks": {
    "tests": [
      {
        "input": "5 3\n2 -1 4 0 3\n1 5\n2 4\n3 3\n",
        "output": "8\n3\n4\n"
      },
      {
        "input": "1 2\n7\n1 1\n1 1\n",
        "output": "7\n7\n"
      },
      {
        "input": "4 2\n-4 -3 -2 -1\n1 4\n2 3\n",
        "output": "-10\n-5\n"
      },
      {
        "input": "3 2\n0 0 0\n1 3\n2 2\n",
        "output": "0\n0\n"
      },
      {
        "input": "4 2\n1000000000 1000000000 -1000000000 5\n1 2\n1 4\n",
        "output": "2000000000\n1000000005\n"
      },
      {
        "input": "6 3\n1 2 3 4 5 6\n6 6\n1 1\n2 5\n",
        "output": "6\n1\n14\n"
      },
      {
        "input": "2 3\n5 -5\n1 2\n1 1\n2 2\n",
        "output": "0\n5\n-5\n"
      },
      {
        "input": "5 2\n9 8 7 6 5\n2 5\n4 4\n",
        "output": "26\n6\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nv=list(map(int,sys.stdin.read().split())); n,q=v[:2]; p=[0]\nfor x in v[2:2+n]: p.append(p[-1]+x)\nfor i in range(q):\n    l,r=v[2+n+2*i:4+n+2*i]; print(p[r]-p[l-1])\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,q;cin>>n>>q;vector<long long>p(n+1);for(int i=1;i<=n;i++){long long x;cin>>x;p[i]=p[i-1]+x;}while(q--){int l,r;cin>>l>>r;cout<<p[r]-p[l-1]<<\"\\n\";}\nreturn 0;}\n"
    }
  },
  "pa-rastuci-segment": {
    "tests": [
      {
        "input": "5\n1 2 3 1 2\n",
        "output": "3\n"
      },
      {
        "input": "3\n5 4 3\n",
        "output": "1\n"
      },
      {
        "input": "1\n7\n",
        "output": "1\n"
      },
      {
        "input": "3\n2 2 2\n",
        "output": "1\n"
      },
      {
        "input": "5\n-3 -2 -1 0 1\n",
        "output": "5\n"
      },
      {
        "input": "7\n4 5 1 2 3 4 0\n",
        "output": "4\n"
      },
      {
        "input": "6\n1 2 2 3 4 5\n",
        "output": "4\n"
      },
      {
        "input": "5\n5 4 3 2 1\n",
        "output": "1\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); a=list(map(int,sys.stdin.read().split())); best=cur=1\nfor i in range(1,n):\n    cur=cur+1 if a[i]>a[i-1] else 1; best=max(best,cur)\nprint(best)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int best=1,cur=1;for(int i=1;i<n;i++){cur=a[i]>a[i-1]?cur+1:1;best=max(best,cur);}cout<<best;\nreturn 0;}\n"
    }
  },
  "pa-dijagonale": {
    "tests": [
      {
        "input": "2\n1 2\n3 4\n",
        "output": "5 5\n"
      },
      {
        "input": "3\n1 2 3\n4 5 6\n7 8 9\n",
        "output": "15 15\n"
      },
      {
        "input": "1\n-8\n",
        "output": "-8 -8\n"
      },
      {
        "input": "2\n0 0\n0 0\n",
        "output": "0 0\n"
      },
      {
        "input": "3\n-5 0 2\n4 -6 8\n1 2 -7\n",
        "output": "-18 -3\n"
      },
      {
        "input": "4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16\n",
        "output": "34 34\n"
      },
      {
        "input": "3\n1000000 0 0\n0 1000000 0\n0 0 1000000\n",
        "output": "3000000 1000000\n"
      },
      {
        "input": "2\n-1 8\n9 -2\n",
        "output": "-3 17\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); a=[list(map(int,input().split())) for _ in range(n)]; print(sum(a[i][i] for i in range(n)),sum(a[i][n-1-i] for i in range(n)))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;long long d=0,s=0,x;for(int i=0;i<n;i++)for(int j=0;j<n;j++){cin>>x;if(i==j)d+=x;if(i+j==n-1)s+=x;}cout<<d<<\" \"<<s;\nreturn 0;}\n"
    }
  },
  "pa-transponuj": {
    "tests": [
      {
        "input": "2 3\n1 2 3\n4 5 6\n",
        "output": "1 4\n2 5\n3 6\n"
      },
      {
        "input": "3 1\n7\n8\n9\n",
        "output": "7 8 9\n"
      },
      {
        "input": "1 1\n0\n",
        "output": "0\n"
      },
      {
        "input": "1 4\n-1 -2 -3 -4\n",
        "output": "-1\n-2\n-3\n-4\n"
      },
      {
        "input": "2 2\n5 5\n5 5\n",
        "output": "5 5\n5 5\n"
      },
      {
        "input": "3 2\n1 -2\n3 -4\n5 -6\n",
        "output": "1 3 5\n-2 -4 -6\n"
      },
      {
        "input": "2 4\n1 2 3 4\n5 6 7 8\n",
        "output": "1 5\n2 6\n3 7\n4 8\n"
      },
      {
        "input": "4 1\n0\n-2\n0\n5\n",
        "output": "0 -2 0 5\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nr,c=map(int,input().split()); a=[list(map(int,input().split()))for _ in range(r)]\nfor j in range(c): print(*(a[i][j]for i in range(r)))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c;cin>>r>>c;vector<vector<long long>>a(r,vector<long long>(c));for(auto&row:a)for(auto&x:row)cin>>x;for(int j=0;j<c;j++){for(int i=0;i<r;i++)cout<<a[i][j]<<\" \";cout<<\"\\n\";}\nreturn 0;}\n"
    }
  },
  "pa-rotacija": {
    "tests": [
      {
        "input": "5 2\n1 2 3 4 5\n",
        "output": "4 5 1 2 3\n"
      },
      {
        "input": "3 1\n7 8 9\n",
        "output": "9 7 8\n"
      },
      {
        "input": "1 999\n-4\n",
        "output": "-4\n"
      },
      {
        "input": "4 0\n1 2 3 4\n",
        "output": "1 2 3 4\n"
      },
      {
        "input": "4 8\n4 3 2 1\n",
        "output": "4 3 2 1\n"
      },
      {
        "input": "5 1000000000\n-5 0 2 2 8\n",
        "output": "-5 0 2 2 8\n"
      },
      {
        "input": "4 5\n1 2 3 4\n",
        "output": "4 1 2 3\n"
      },
      {
        "input": "3 2\n9 9 1\n",
        "output": "9 1 9\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn,k=map(int,input().split()); a=list(map(int,sys.stdin.read().split())); k%=n; print(*(a[-k:]+a[:-k] if k else a))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;k%=n;for(int i=0;i<n;i++)cout<<a[(i+n-k)%n]<<\" \";\nreturn 0;}\n"
    }
  },
  "pa-palindrom": {
    "tests": [
      {
        "input": "radar\n",
        "output": "DA\n"
      },
      {
        "input": "skola\n",
        "output": "NE\n"
      },
      {
        "input": "a\n",
        "output": "DA\n"
      },
      {
        "input": "aa\n",
        "output": "DA\n"
      },
      {
        "input": "ab\n",
        "output": "NE\n"
      },
      {
        "input": "abccba\n",
        "output": "DA\n"
      },
      {
        "input": "abcdefghihgfedcba\n",
        "output": "DA\n"
      },
      {
        "input": "abca\n",
        "output": "NE\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\ns=input().strip(); print(\"DA\" if s==s[::-1] else \"NE\")\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;cin>>s;string r=s;reverse(r.begin(),r.end());cout<<(s==r?\"DA\":\"NE\");\nreturn 0;}\n"
    }
  },
  "pa-frekvencija": {
    "tests": [
      {
        "input": "banana\n",
        "output": "a 3\n"
      },
      {
        "input": "cabb\n",
        "output": "b 2\n"
      },
      {
        "input": "z\n",
        "output": "z 1\n"
      },
      {
        "input": "zyx\n",
        "output": "x 1\n"
      },
      {
        "input": "aaaaa\n",
        "output": "a 5\n"
      },
      {
        "input": "abccba\n",
        "output": "a 2\n"
      },
      {
        "input": "aaaabbbb\n",
        "output": "a 4\n"
      },
      {
        "input": "azzzyyy\n",
        "output": "y 3\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\ns=input().strip(); c=Counter(s); m=max(c.values()); ch=min(k for k in c if c[k]==m); print(ch,m)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;cin>>s;int c[26]={};for(char x:s)c[x-'a']++;int p=0;for(int i=1;i<26;i++)if(c[i]>c[p])p=i;cout<<char('a'+p)<<\" \"<<c[p];\nreturn 0;}\n"
    }
  },
  "pa-rijeci": {
    "tests": [
      {
        "input": "ucimo programiranje danas\n",
        "output": "3\n"
      },
      {
        "input": "  jedan   dva  \n",
        "output": "2\n"
      },
      {
        "input": "\n",
        "output": "0\n"
      },
      {
        "input": "       \n",
        "output": "0\n"
      },
      {
        "input": "rijec\n",
        "output": "1\n"
      },
      {
        "input": "a b c d e\n",
        "output": "5\n"
      },
      {
        "input": " a \n",
        "output": "1\n"
      },
      {
        "input": "   a  b   c\n",
        "output": "3\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nprint(len(sys.stdin.readline().split()))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;getline(cin,s);stringstream ss(s);string w;int n=0;while(ss>>w)n++;cout<<n;\nreturn 0;}\n"
    }
  },
  "pa-rle": {
    "tests": [
      {
        "input": "aaabbc\n",
        "output": "a:3 b:2 c:1\n"
      },
      {
        "input": "ababa\n",
        "output": "a:1 b:1 a:1 b:1 a:1\n"
      },
      {
        "input": "a\n",
        "output": "a:1\n"
      },
      {
        "input": "zzzzzzzzzz\n",
        "output": "z:10\n"
      },
      {
        "input": "aabbbaa\n",
        "output": "a:2 b:3 a:2\n"
      },
      {
        "input": "xyzzzyx\n",
        "output": "x:1 y:1 z:3 y:1 x:1\n"
      },
      {
        "input": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n",
        "output": "a:100\n"
      },
      {
        "input": "abcddddeeefffg\n",
        "output": "a:1 b:1 c:1 d:4 e:3 f:3 g:1\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\ns=input().strip(); parts=[]; i=0\nwhile i<len(s):\n    j=i+1\n    while j<len(s) and s[j]==s[i]: j+=1\n    parts.append(s[i]+\":\"+str(j-i)); i=j\nprint(\" \".join(parts))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;cin>>s;for(int i=0;i<(int)s.size();){int j=i+1;while(j<(int)s.size()&&s[j]==s[i])j++;cout<<s[i]<<\":\"<<j-i<<\" \";i=j;}\nreturn 0;}\n"
    }
  },
  "pa-binarni-decimalni": {
    "tests": [
      {
        "input": "1011\n",
        "output": "11\n"
      },
      {
        "input": "00101\n",
        "output": "5\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      },
      {
        "input": "1\n",
        "output": "1\n"
      },
      {
        "input": "111111111111111111111111111111\n",
        "output": "1073741823\n"
      },
      {
        "input": "100000000000000000000000000000\n",
        "output": "536870912\n"
      },
      {
        "input": "000000000000000000000000000001\n",
        "output": "1\n"
      },
      {
        "input": "101010101010101010101010101010\n",
        "output": "715827882\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nprint(int(input().strip(),2))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;cin>>s;long long n=0;for(char c:s)n=n*2+(c-'0');cout<<n;\nreturn 0;}\n"
    }
  },
  "pa-decimalni-baza": {
    "tests": [
      {
        "input": "255 16\n",
        "output": "FF\n"
      },
      {
        "input": "83 8\n",
        "output": "123\n"
      },
      {
        "input": "0 2\n",
        "output": "0\n"
      },
      {
        "input": "1 16\n",
        "output": "1\n"
      },
      {
        "input": "1000000000000 2\n",
        "output": "1110100011010100101001010001000000000000\n"
      },
      {
        "input": "123456789 7\n",
        "output": "3026236221\n"
      },
      {
        "input": "15 16\n",
        "output": "F\n"
      },
      {
        "input": "1000000000000 16\n",
        "output": "E8D4A51000\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn,b=map(int,input().split()); d=\"0123456789ABCDEF\"; s=\"\"\nwhile n: s=d[n%b]+s; n//=b\nprint(s or \"0\")\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;int b;cin>>n>>b;string d=\"0123456789ABCDEF\",s;do{s+=d[n%b];n/=b;}while(n);reverse(s.begin(),s.end());cout<<s;\nreturn 0;}\n"
    }
  },
  "pa-zagrade": {
    "tests": [
      {
        "input": "(())()\n",
        "output": "DA\n"
      },
      {
        "input": "())(\n",
        "output": "NE\n"
      },
      {
        "input": "\n",
        "output": "DA\n"
      },
      {
        "input": ")(()\n",
        "output": "NE\n"
      },
      {
        "input": "((((\n",
        "output": "NE\n"
      },
      {
        "input": "()()()\n",
        "output": "DA\n"
      },
      {
        "input": "(()\n",
        "output": "NE\n"
      },
      {
        "input": "(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((())))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))\n",
        "output": "DA\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\ns=sys.stdin.readline().strip(); bal=0; ok=True\nfor c in s:\n    bal+=1 if c==\"(\" else -1\n    if bal<0: ok=False\nprint(\"DA\" if ok and bal==0 else \"NE\")\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;getline(cin,s);int bal=0;bool ok=true;for(char c:s){bal+=c=='('?1:-1;if(bal<0)ok=false;}cout<<(ok&&bal==0?\"DA\":\"NE\");\nreturn 0;}\n"
    }
  },
  "pa-anagram": {
    "tests": [
      {
        "input": "slika\nklisa\n",
        "output": "DA\n"
      },
      {
        "input": "ana\nan\n",
        "output": "NE\n"
      },
      {
        "input": "a\na\n",
        "output": "DA\n"
      },
      {
        "input": "ab\nac\n",
        "output": "NE\n"
      },
      {
        "input": "aabb\nbbaa\n",
        "output": "DA\n"
      },
      {
        "input": "aaa\naaab\n",
        "output": "NE\n"
      },
      {
        "input": "abc\ncba\n",
        "output": "DA\n"
      },
      {
        "input": "aabbcc\nabcccd\n",
        "output": "NE\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\na=input().strip(); b=input().strip(); print(\"DA\" if Counter(a)==Counter(b) else \"NE\")\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring a,b;cin>>a>>b;sort(a.begin(),a.end());sort(b.begin(),b.end());cout<<(a==b?\"DA\":\"NE\");\nreturn 0;}\n"
    }
  },
  "pa-spajanje": {
    "tests": [
      {
        "input": "3 4\n1 4 8\n2 4 6 9\n",
        "output": "1 2 4 4 6 8 9\n"
      },
      {
        "input": "1 1\n5\n5\n",
        "output": "5 5\n"
      },
      {
        "input": "0 3\n\n-2 0 7\n",
        "output": "-2 0 7\n"
      },
      {
        "input": "3 0\n1 2 3\n\n",
        "output": "1 2 3\n"
      },
      {
        "input": "0 0\n\n\n",
        "output": "\n"
      },
      {
        "input": "4 3\n-5 -3 0 9\n-8 0 10\n",
        "output": "-8 -5 -3 0 0 9 10\n"
      },
      {
        "input": "2 3\n1 1\n1 1 1\n",
        "output": "1 1 1 1 1\n"
      },
      {
        "input": "2 2\n1000000000 1000000000\n-1000000000 -1000000000\n",
        "output": "-1000000000 -1000000000 1000000000 1000000000\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nv=list(map(int,sys.stdin.read().split())); n,m=v[:2]; a=v[2:2+n]; b=v[2+n:]; i=j=0; out=[]\nwhile i<n and j<m:\n    if a[i]<=b[j]: out.append(a[i]); i+=1\n    else: out.append(b[j]); j+=1\nprint(*(out+a[i:]+b[j:]))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<long long>a(n),b(m);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;int i=0,j=0;while(i<n&&j<m){if(a[i]<=b[j])cout<<a[i++]<<\" \";else cout<<b[j++]<<\" \";}while(i<n)cout<<a[i++]<<\" \";while(j<m)cout<<b[j++]<<\" \";cout<<\"\\n\";\nreturn 0;}\n"
    }
  },
  "pa-binarna-pretraga": {
    "tests": [
      {
        "input": "5 4\n1 3 3 7 9\n3 4 1 9\n",
        "output": "2\n0\n1\n5\n"
      },
      {
        "input": "1 3\n0\n0 -1 1\n",
        "output": "1\n0\n0\n"
      },
      {
        "input": "4 3\n-8 -5 -5 -2\n-5 -9 0\n",
        "output": "2\n0\n0\n"
      },
      {
        "input": "3 2\n2 2 2\n2 3\n",
        "output": "1\n0\n"
      },
      {
        "input": "0 2\n\n1 0\n",
        "output": "0\n0\n"
      },
      {
        "input": "6 4\n1 2 3 4 5 6\n6 7 1 4\n",
        "output": "6\n0\n1\n4\n"
      },
      {
        "input": "4 3\n1 1 1 2\n1 2 0\n",
        "output": "1\n4\n0\n"
      },
      {
        "input": "2 2\n-1000000000 1000000000\n1000000000 -1000000000\n",
        "output": "2\n1\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nimport bisect\nv=list(map(int,sys.stdin.read().split())); n,q=v[:2]; a=v[2:2+n]\nfor x in v[2+n:]:\n    p=bisect.bisect_left(a,x); print(p+1 if p<n and a[p]==x else 0)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){long long x;cin>>x;auto it=lower_bound(a.begin(),a.end(),x);cout<<(it!=a.end()&&*it==x?it-a.begin()+1:0)<<\"\\n\";}\nreturn 0;}\n"
    }
  },
  "pa-dubina-zagrada": {
    "tests": [
      {
        "input": "(()(()))\n",
        "output": "3\n"
      },
      {
        "input": "()()\n",
        "output": "1\n"
      },
      {
        "input": "\n",
        "output": "0\n"
      },
      {
        "input": ")(()\n",
        "output": "-1\n"
      },
      {
        "input": "(((\n",
        "output": "-1\n"
      },
      {
        "input": "(((())))\n",
        "output": "4\n"
      },
      {
        "input": "())\n",
        "output": "-1\n"
      },
      {
        "input": "(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((())))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))\n",
        "output": "100\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\ns=sys.stdin.readline().strip(); bal=best=0; ok=True\nfor c in s:\n    bal+=1 if c==\"(\" else -1; best=max(best,bal)\n    if bal<0: ok=False\nprint(best if ok and bal==0 else -1)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;getline(cin,s);int bal=0,best=0;bool ok=true;for(char c:s){bal+=c=='('?1:-1;best=max(best,bal);if(bal<0)ok=false;}cout<<(ok&&bal==0?best:-1);\nreturn 0;}\n"
    }
  },
  "pa-bfs": {
    "tests": [
      {
        "input": "4 4 1 4\n1 2\n2 4\n1 3\n3 4\n",
        "output": "2\n"
      },
      {
        "input": "4 2 1 4\n1 2\n3 4\n",
        "output": "-1\n"
      },
      {
        "input": "1 0 1 1\n",
        "output": "0\n"
      },
      {
        "input": "3 3 2 3\n1 2\n2 3\n1 3\n",
        "output": "1\n"
      },
      {
        "input": "5 4 1 5\n1 2\n2 3\n3 4\n4 5\n",
        "output": "4\n"
      },
      {
        "input": "4 4 1 3\n1 2\n1 2\n2 3\n3 4\n",
        "output": "2\n"
      },
      {
        "input": "3 1 1 2\n1 1\n",
        "output": "-1\n"
      },
      {
        "input": "6 6 1 6\n1 2\n2 3\n3 6\n1 4\n4 6\n4 5\n",
        "output": "2\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nv=list(map(int,sys.stdin.read().split())); n,m,s,t=v[:4]; a=[[]for _ in range(n+1)]\nfor i in range(m):\n    u,w=v[4+2*i:6+2*i]; a[u].append(w); a[w].append(u)\nd=[-1]*(n+1); d[s]=0; q=deque([s])\nwhile q:\n    u=q.popleft()\n    for w in a[u]:\n        if d[w]<0: d[w]=d[u]+1; q.append(w)\nprint(d[t])\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m,s,t;cin>>n>>m>>s>>t;vector<vector<int>>a(n+1);while(m--){int u,v;cin>>u>>v;a[u].push_back(v);a[v].push_back(u);}vector<int>d(n+1,-1);queue<int>q;q.push(s);d[s]=0;while(!q.empty()){int u=q.front();q.pop();for(int v:a[u])if(d[v]<0){d[v]=d[u]+1;q.push(v);}}cout<<d[t];\nreturn 0;}\n"
    }
  },
  "pa-komponente": {
    "tests": [
      {
        "input": "5 2\n1 2\n3 4\n",
        "output": "3\n"
      },
      {
        "input": "3 2\n1 2\n2 3\n",
        "output": "1\n"
      },
      {
        "input": "1 0\n",
        "output": "1\n"
      },
      {
        "input": "5 0\n",
        "output": "5\n"
      },
      {
        "input": "4 4\n1 2\n2 3\n3 4\n4 1\n",
        "output": "1\n"
      },
      {
        "input": "4 3\n1 1\n2 3\n2 3\n",
        "output": "3\n"
      },
      {
        "input": "3 3\n1 1\n2 2\n3 3\n",
        "output": "3\n"
      },
      {
        "input": "6 4\n1 2\n2 3\n4 5\n5 6\n",
        "output": "2\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nv=list(map(int,sys.stdin.read().split())); n,m=v[:2]; a=[[]for _ in range(n+1)]\nfor i in range(m):\n    u,w=v[2+2*i:4+2*i]; a[u].append(w); a[w].append(u)\nseen=set(); count=0\nfor s in range(1,n+1):\n    if s in seen: continue\n    count+=1; seen.add(s); stack=[s]\n    while stack:\n        u=stack.pop()\n        for w in a[u]:\n            if w not in seen: seen.add(w); stack.append(w)\nprint(count)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<vector<int>>a(n+1);while(m--){int u,v;cin>>u>>v;a[u].push_back(v);a[v].push_back(u);}vector<bool>seen(n+1);int c=0;for(int s=1;s<=n;s++)if(!seen[s]){c++;vector<int>q{s};seen[s]=true;while(!q.empty()){int u=q.back();q.pop_back();for(int v:a[u])if(!seen[v]){seen[v]=true;q.push_back(v);}}}cout<<c;\nreturn 0;}\n"
    }
  },
  "pa-dijkstra": {
    "tests": [
      {
        "input": "4 4 1 4\n1 2 3\n2 4 4\n1 3 10\n3 4 1\n",
        "output": "7\n"
      },
      {
        "input": "3 1 1 3\n1 2 5\n",
        "output": "-1\n"
      },
      {
        "input": "1 0 1 1\n",
        "output": "0\n"
      },
      {
        "input": "3 3 1 3\n1 2 0\n2 3 0\n1 3 9\n",
        "output": "0\n"
      },
      {
        "input": "3 3 1 3\n1 2 1000000000\n2 3 1000000000\n1 3 3000000000\n",
        "output": "2000000000\n"
      },
      {
        "input": "4 5 1 4\n1 2 20\n1 3 1\n3 2 1\n2 4 1\n3 4 50\n",
        "output": "3\n"
      },
      {
        "input": "3 3 1 3\n1 2 100\n1 2 1\n2 3 2\n",
        "output": "3\n"
      },
      {
        "input": "2 1 1 2\n1 2 10000000000\n",
        "output": "10000000000\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nv=list(map(int,sys.stdin.read().split())); n,m,s,t=v[:4]; a=[[]for _ in range(n+1)]\nfor i in range(m):\n    u,w,z=v[4+3*i:7+3*i]; a[u].append((w,z)); a[w].append((u,z))\nd=[math.inf]*(n+1); d[s]=0; pq=[(0,s)]\nwhile pq:\n    val,u=heapq.heappop(pq)\n    if val!=d[u]: continue\n    for w,z in a[u]:\n        if val+z<d[w]: d[w]=val+z; heapq.heappush(pq,(d[w],w))\nprint(-1 if d[t]==math.inf else d[t])\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m,s,t;cin>>n>>m>>s>>t;vector<vector<pair<int,long long>>>a(n+1);while(m--){int u,v;long long w;cin>>u>>v>>w;a[u].push_back({v,w});a[v].push_back({u,w});}const long long INF=LLONG_MAX/4;vector<long long>d(n+1,INF);priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<pair<long long,int>>>q;d[s]=0;q.push({0,s});while(!q.empty()){auto [val,u]=q.top();q.pop();if(val!=d[u])continue;for(auto [v,w]:a[u])if(val+w<d[v]){d[v]=val+w;q.push({d[v],v});}}cout<<(d[t]==INF?-1:d[t]);\nreturn 0;}\n"
    }
  },
  "pa-raspored": {
    "tests": [
      {
        "input": "4\n1 3\n2 4\n3 5\n5 8\n",
        "output": "3\n"
      },
      {
        "input": "3\n0 2\n2 4\n4 6\n",
        "output": "3\n"
      },
      {
        "input": "0\n",
        "output": "0\n"
      },
      {
        "input": "3\n1 10\n2 9\n3 8\n",
        "output": "1\n"
      },
      {
        "input": "4\n-5 -3\n-3 -1\n0 2\n-4 1\n",
        "output": "3\n"
      },
      {
        "input": "5\n1 2\n1 2\n2 3\n3 4\n1 5\n",
        "output": "3\n"
      },
      {
        "input": "4\n1 4\n2 3\n3 4\n4 5\n",
        "output": "3\n"
      },
      {
        "input": "2\n-1000000000 0\n0 1000000000\n",
        "output": "2\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nv=list(map(int,sys.stdin.read().split())); p=sorted(zip(v[1::2],v[2::2]),key=lambda x:(x[1],x[0])); last=-math.inf; count=0\nfor start,end in p:\n    if start>=last: count+=1; last=end\nprint(count)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<pair<long long,long long>>a;while(n--){long long s,e;cin>>s>>e;a.push_back({e,s});}sort(a.begin(),a.end());long long last=LLONG_MIN;int c=0;for(auto [e,s]:a)if(s>=last){c++;last=e;}cout<<c;\nreturn 0;}\n"
    }
  },
  "pa-kovanice": {
    "tests": [
      {
        "input": "3 11\n1 5 7\n",
        "output": "3\n"
      },
      {
        "input": "2 3\n2 4\n",
        "output": "-1\n"
      },
      {
        "input": "1 0\n5\n",
        "output": "0\n"
      },
      {
        "input": "2 6\n1 3\n",
        "output": "2\n"
      },
      {
        "input": "3 6\n1 3 4\n",
        "output": "2\n"
      },
      {
        "input": "3 27\n2 7 10\n",
        "output": "3\n"
      },
      {
        "input": "2 8\n3 5\n",
        "output": "2\n"
      },
      {
        "input": "3 10000\n1 7 10\n",
        "output": "1000\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nv=list(map(int,sys.stdin.read().split())); n,S=v[:2]; c=v[2:]; inf=S+1; dp=[0]+[inf]*S\nfor x in range(1,S+1):\n    for z in c:\n        if z<=x: dp[x]=min(dp[x],dp[x-z]+1)\nprint(-1 if dp[S]>=inf else dp[S])\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,S;cin>>n>>S;vector<int>c(n);for(auto&x:c)cin>>x;vector<int>dp(S+1,S+1);dp[0]=0;for(int x=1;x<=S;x++)for(int z:c)if(z<=x)dp[x]=min(dp[x],dp[x-z]+1);cout<<(dp[S]>S?-1:dp[S]);\nreturn 0;}\n"
    }
  },
  "pa-lis": {
    "tests": [
      {
        "input": "5\n3 1 2 5 4\n",
        "output": "3\n"
      },
      {
        "input": "4\n5 4 3 2\n",
        "output": "1\n"
      },
      {
        "input": "0\n\n",
        "output": "0\n"
      },
      {
        "input": "1\n7\n",
        "output": "1\n"
      },
      {
        "input": "4\n2 2 2 2\n",
        "output": "1\n"
      },
      {
        "input": "5\n-5 0 -2 1 8\n",
        "output": "4\n"
      },
      {
        "input": "5\n1 2 3 4 5\n",
        "output": "5\n"
      },
      {
        "input": "7\n10 1 9 2 8 3 7\n",
        "output": "4\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nimport bisect\nn=int(input()); a=list(map(int,sys.stdin.read().split())); tail=[]\nfor x in a:\n    p=bisect.bisect_left(tail,x)\n    if p==len(tail): tail.append(x)\n    else: tail[p]=x\nprint(len(tail))\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<long long>t;while(n--){long long x;cin>>x;auto it=lower_bound(t.begin(),t.end(),x);if(it==t.end())t.push_back(x);else *it=x;}cout<<t.size();\nreturn 0;}\n"
    }
  },
  "pa-ruksak": {
    "tests": [
      {
        "input": "3 5\n2 3\n3 4\n4 5\n",
        "output": "7\n"
      },
      {
        "input": "2 1\n2 9\n3 10\n",
        "output": "0\n"
      },
      {
        "input": "0 8\n",
        "output": "0\n"
      },
      {
        "input": "3 0\n1 3\n2 5\n3 7\n",
        "output": "0\n"
      },
      {
        "input": "3 4\n2 6\n2 6\n4 10\n",
        "output": "12\n"
      },
      {
        "input": "4 7\n3 4\n4 5\n2 3\n5 8\n",
        "output": "11\n"
      },
      {
        "input": "1 6\n3 5\n",
        "output": "5\n"
      },
      {
        "input": "2 10000\n5000 1000000\n5000 1000000\n",
        "output": "2000000\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nv=list(map(int,sys.stdin.read().split())); n,W=v[:2]; dp=[0]*(W+1)\nfor i in range(n):\n    w,val=v[2+2*i:4+2*i]\n    for c in range(W,w-1,-1): dp[c]=max(dp[c],dp[c-w]+val)\nprint(dp[W])\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,W;cin>>n>>W;vector<long long>dp(W+1);while(n--){int w;long long v;cin>>w>>v;for(int c=W;c>=w;c--)dp[c]=max(dp[c],dp[c-w]+v);}cout<<dp[W];\nreturn 0;}\n"
    }
  },
  "pa-sito": {
    "tests": [
      {
        "input": "20\n",
        "output": "2 3 5 7 11 13 17 19\n"
      },
      {
        "input": "5\n",
        "output": "2 3 5\n"
      },
      {
        "input": "0\n",
        "output": "-\n"
      },
      {
        "input": "1\n",
        "output": "-\n"
      },
      {
        "input": "2\n",
        "output": "2\n"
      },
      {
        "input": "1000\n",
        "output": "2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59 61 67 71 73 79 83 89 97 101 103 107 109 113 127 131 137 139 149 151 157 163 167 173 179 181 191 193 197 199 211 223 227 229 233 239 241 251 257 263 269 271 277 281 283 293 307 311 313 317 331 337 347 349 353 359 367 373 379 383 389 397 401 409 419 421 431 433 439 443 449 457 461 463 467 479 487 491 499 503 509 521 523 541 547 557 563 569 571 577 587 593 599 601 607 613 617 619 631 641 643 647 653 659 661 673 677 683 691 701 709 719 727 733 739 743 751 757 761 769 773 787 797 809 811 821 823 827 829 839 853 857 859 863 877 881 883 887 907 911 919 929 937 941 947 953 967 971 977 983 991 997\n"
      },
      {
        "input": "49\n",
        "output": "2 3 5 7 11 13 17 19 23 29 31 37 41 43 47\n"
      },
      {
        "input": "10000\n",
        "output": "2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59 61 67 71 73 79 83 89 97 101 103 107 109 113 127 131 137 139 149 151 157 163 167 173 179 181 191 193 197 199 211 223 227 229 233 239 241 251 257 263 269 271 277 281 283 293 307 311 313 317 331 337 347 349 353 359 367 373 379 383 389 397 401 409 419 421 431 433 439 443 449 457 461 463 467 479 487 491 499 503 509 521 523 541 547 557 563 569 571 577 587 593 599 601 607 613 617 619 631 641 643 647 653 659 661 673 677 683 691 701 709 719 727 733 739 743 751 757 761 769 773 787 797 809 811 821 823 827 829 839 853 857 859 863 877 881 883 887 907 911 919 929 937 941 947 953 967 971 977 983 991 997 1009 1013 1019 1021 1031 1033 1039 1049 1051 1061 1063 1069 1087 1091 1093 1097 1103 1109 1117 1123 1129 1151 1153 1163 1171 1181 1187 1193 1201 1213 1217 1223 1229 1231 1237 1249 1259 1277 1279 1283 1289 1291 1297 1301 1303 1307 1319 1321 1327 1361 1367 1373 1381 1399 1409 1423 1427 1429 1433 1439 1447 1451 1453 1459 1471 1481 1483 1487 1489 1493 1499 1511 1523 1531 1543 1549 1553 1559 1567 1571 1579 1583 1597 1601 1607 1609 1613 1619 1621 1627 1637 1657 1663 1667 1669 1693 1697 1699 1709 1721 1723 1733 1741 1747 1753 1759 1777 1783 1787 1789 1801 1811 1823 1831 1847 1861 1867 1871 1873 1877 1879 1889 1901 1907 1913 1931 1933 1949 1951 1973 1979 1987 1993 1997 1999 2003 2011 2017 2027 2029 2039 2053 2063 2069 2081 2083 2087 2089 2099 2111 2113 2129 2131 2137 2141 2143 2153 2161 2179 2203 2207 2213 2221 2237 2239 2243 2251 2267 2269 2273 2281 2287 2293 2297 2309 2311 2333 2339 2341 2347 2351 2357 2371 2377 2381 2383 2389 2393 2399 2411 2417 2423 2437 2441 2447 2459 2467 2473 2477 2503 2521 2531 2539 2543 2549 2551 2557 2579 2591 2593 2609 2617 2621 2633 2647 2657 2659 2663 2671 2677 2683 2687 2689 2693 2699 2707 2711 2713 2719 2729 2731 2741 2749 2753 2767 2777 2789 2791 2797 2801 2803 2819 2833 2837 2843 2851 2857 2861 2879 2887 2897 2903 2909 2917 2927 2939 2953 2957 2963 2969 2971 2999 3001 3011 3019 3023 3037 3041 3049 3061 3067 3079 3083 3089 3109 3119 3121 3137 3163 3167 3169 3181 3187 3191 3203 3209 3217 3221 3229 3251 3253 3257 3259 3271 3299 3301 3307 3313 3319 3323 3329 3331 3343 3347 3359 3361 3371 3373 3389 3391 3407 3413 3433 3449 3457 3461 3463 3467 3469 3491 3499 3511 3517 3527 3529 3533 3539 3541 3547 3557 3559 3571 3581 3583 3593 3607 3613 3617 3623 3631 3637 3643 3659 3671 3673 3677 3691 3697 3701 3709 3719 3727 3733 3739 3761 3767 3769 3779 3793 3797 3803 3821 3823 3833 3847 3851 3853 3863 3877 3881 3889 3907 3911 3917 3919 3923 3929 3931 3943 3947 3967 3989 4001 4003 4007 4013 4019 4021 4027 4049 4051 4057 4073 4079 4091 4093 4099 4111 4127 4129 4133 4139 4153 4157 4159 4177 4201 4211 4217 4219 4229 4231 4241 4243 4253 4259 4261 4271 4273 4283 4289 4297 4327 4337 4339 4349 4357 4363 4373 4391 4397 4409 4421 4423 4441 4447 4451 4457 4463 4481 4483 4493 4507 4513 4517 4519 4523 4547 4549 4561 4567 4583 4591 4597 4603 4621 4637 4639 4643 4649 4651 4657 4663 4673 4679 4691 4703 4721 4723 4729 4733 4751 4759 4783 4787 4789 4793 4799 4801 4813 4817 4831 4861 4871 4877 4889 4903 4909 4919 4931 4933 4937 4943 4951 4957 4967 4969 4973 4987 4993 4999 5003 5009 5011 5021 5023 5039 5051 5059 5077 5081 5087 5099 5101 5107 5113 5119 5147 5153 5167 5171 5179 5189 5197 5209 5227 5231 5233 5237 5261 5273 5279 5281 5297 5303 5309 5323 5333 5347 5351 5381 5387 5393 5399 5407 5413 5417 5419 5431 5437 5441 5443 5449 5471 5477 5479 5483 5501 5503 5507 5519 5521 5527 5531 5557 5563 5569 5573 5581 5591 5623 5639 5641 5647 5651 5653 5657 5659 5669 5683 5689 5693 5701 5711 5717 5737 5741 5743 5749 5779 5783 5791 5801 5807 5813 5821 5827 5839 5843 5849 5851 5857 5861 5867 5869 5879 5881 5897 5903 5923 5927 5939 5953 5981 5987 6007 6011 6029 6037 6043 6047 6053 6067 6073 6079 6089 6091 6101 6113 6121 6131 6133 6143 6151 6163 6173 6197 6199 6203 6211 6217 6221 6229 6247 6257 6263 6269 6271 6277 6287 6299 6301 6311 6317 6323 6329 6337 6343 6353 6359 6361 6367 6373 6379 6389 6397 6421 6427 6449 6451 6469 6473 6481 6491 6521 6529 6547 6551 6553 6563 6569 6571 6577 6581 6599 6607 6619 6637 6653 6659 6661 6673 6679 6689 6691 6701 6703 6709 6719 6733 6737 6761 6763 6779 6781 6791 6793 6803 6823 6827 6829 6833 6841 6857 6863 6869 6871 6883 6899 6907 6911 6917 6947 6949 6959 6961 6967 6971 6977 6983 6991 6997 7001 7013 7019 7027 7039 7043 7057 7069 7079 7103 7109 7121 7127 7129 7151 7159 7177 7187 7193 7207 7211 7213 7219 7229 7237 7243 7247 7253 7283 7297 7307 7309 7321 7331 7333 7349 7351 7369 7393 7411 7417 7433 7451 7457 7459 7477 7481 7487 7489 7499 7507 7517 7523 7529 7537 7541 7547 7549 7559 7561 7573 7577 7583 7589 7591 7603 7607 7621 7639 7643 7649 7669 7673 7681 7687 7691 7699 7703 7717 7723 7727 7741 7753 7757 7759 7789 7793 7817 7823 7829 7841 7853 7867 7873 7877 7879 7883 7901 7907 7919 7927 7933 7937 7949 7951 7963 7993 8009 8011 8017 8039 8053 8059 8069 8081 8087 8089 8093 8101 8111 8117 8123 8147 8161 8167 8171 8179 8191 8209 8219 8221 8231 8233 8237 8243 8263 8269 8273 8287 8291 8293 8297 8311 8317 8329 8353 8363 8369 8377 8387 8389 8419 8423 8429 8431 8443 8447 8461 8467 8501 8513 8521 8527 8537 8539 8543 8563 8573 8581 8597 8599 8609 8623 8627 8629 8641 8647 8663 8669 8677 8681 8689 8693 8699 8707 8713 8719 8731 8737 8741 8747 8753 8761 8779 8783 8803 8807 8819 8821 8831 8837 8839 8849 8861 8863 8867 8887 8893 8923 8929 8933 8941 8951 8963 8969 8971 8999 9001 9007 9011 9013 9029 9041 9043 9049 9059 9067 9091 9103 9109 9127 9133 9137 9151 9157 9161 9173 9181 9187 9199 9203 9209 9221 9227 9239 9241 9257 9277 9281 9283 9293 9311 9319 9323 9337 9341 9343 9349 9371 9377 9391 9397 9403 9413 9419 9421 9431 9433 9437 9439 9461 9463 9467 9473 9479 9491 9497 9511 9521 9533 9539 9547 9551 9587 9601 9613 9619 9623 9629 9631 9643 9649 9661 9677 9679 9689 9697 9719 9721 9733 9739 9743 9749 9767 9769 9781 9787 9791 9803 9811 9817 9829 9833 9839 9851 9857 9859 9871 9883 9887 9901 9907 9923 9929 9931 9941 9949 9967 9973\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nn=int(input()); p=[True]*(n+1)\nif n>=0: p[0]=False\nif n>=1: p[1]=False\nfor d in range(2,math.isqrt(n)+1):\n    if p[d]:\n        for x in range(d*d,n+1,d): p[x]=False\na=[str(x)for x in range(2,n+1)if p[x]]; print(\" \".join(a) or \"-\")\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<bool>p(n+1,true);p[0]=false;if(n>=1)p[1]=false;for(int d=2;d*d<=n;d++)if(p[d])for(int x=d*d;x<=n;x+=d)p[x]=false;bool any=false;for(int x=2;x<=n;x++)if(p[x]){cout<<x<<\" \";any=true;}if(!any)cout<<\"-\";\nreturn 0;}\n"
    }
  },
  "pa-segment-zbir": {
    "tests": [
      {
        "input": "5 5\n1 2 3 2 3\n",
        "output": "3\n"
      },
      {
        "input": "3 7\n1 1 1\n",
        "output": "0\n"
      },
      {
        "input": "1 8\n8\n",
        "output": "1\n"
      },
      {
        "input": "4 2\n1 1 1 1\n",
        "output": "3\n"
      },
      {
        "input": "5 6\n6 1 2 3 6\n",
        "output": "3\n"
      },
      {
        "input": "6 10\n2 3 5 4 6 10\n",
        "output": "3\n"
      },
      {
        "input": "3 1\n2 3 4\n",
        "output": "0\n"
      },
      {
        "input": "5 3\n1 1 1 1 1\n",
        "output": "3\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nv=list(map(int,sys.stdin.read().split())); n,S=v[:2]; a=v[2:]; left=total=ans=0\nfor right,x in enumerate(a):\n    total+=x\n    while left<=right and total>S: total-=a[left]; left+=1\n    if total==S: ans+=1\nprint(ans)\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;long long S;cin>>n>>S;vector<long long>a(n);for(auto&x:a)cin>>x;int l=0,ans=0;long long sum=0;for(int r=0;r<n;r++){sum+=a[r];while(l<=r&&sum>S)sum-=a[l++];if(sum==S)ans++;}cout<<ans;\nreturn 0;}\n"
    }
  },
  "pa-putanje-mreza": {
    "tests": [
      {
        "input": "3 3\n...\n.#.\n...\n",
        "output": "2\n"
      },
      {
        "input": "2 2\n..\n..\n",
        "output": "2\n"
      },
      {
        "input": "1 1\n.\n",
        "output": "1\n"
      },
      {
        "input": "1 1\n#\n",
        "output": "0\n"
      },
      {
        "input": "2 3\n#..\n...\n",
        "output": "0\n"
      },
      {
        "input": "3 3\n...\n###\n...\n",
        "output": "0\n"
      },
      {
        "input": "2 2\n..\n.#\n",
        "output": "0\n"
      },
      {
        "input": "20 20\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n....................\n",
        "output": "345263555\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nr,c=map(int,input().split()); a=[input().strip()for _ in range(r)]; dp=[0]*c\nfor i in range(r):\n    for j in range(c):\n        if a[i][j]==\"#\": dp[j]=0\n        elif i==0 and j==0: dp[j]=1\n        else: dp[j]=(dp[j]+(dp[j-1]if j else 0))%1000000007\nprint(dp[-1])\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c;cin>>r>>c;vector<long long>dp(c);for(int i=0;i<r;i++){string s;cin>>s;for(int j=0;j<c;j++){if(s[j]=='#')dp[j]=0;else if(i==0&&j==0)dp[j]=1;else dp[j]=(dp[j]+(j?dp[j-1]:0))%1000000007;}}cout<<dp.back();\nreturn 0;}\n"
    }
  },
  "pa-topoloski": {
    "tests": [
      {
        "input": "4 3\n1 3\n2 3\n3 4\n",
        "output": "1 2 3 4\n"
      },
      {
        "input": "3 3\n1 2\n2 3\n3 1\n",
        "output": "CIKLUS\n"
      },
      {
        "input": "1 0\n",
        "output": "1\n"
      },
      {
        "input": "4 0\n",
        "output": "1 2 3 4\n"
      },
      {
        "input": "4 3\n4 2\n2 1\n4 3\n",
        "output": "4 2 1 3\n"
      },
      {
        "input": "3 3\n1 2\n1 2\n2 3\n",
        "output": "1 2 3\n"
      },
      {
        "input": "2 1\n1 1\n",
        "output": "CIKLUS\n"
      },
      {
        "input": "5 4\n1 5\n2 5\n3 5\n4 5\n",
        "output": "1 2 3 4 5\n"
      }
    ],
    "solutions": {
      "python": "import sys, math\nfrom collections import deque, Counter\nimport heapq\nv=list(map(int,sys.stdin.read().split())); n,m=v[:2]; a=[[]for _ in range(n+1)]; deg=[0]*(n+1)\nfor i in range(m):\n    u,w=v[2+2*i:4+2*i]; a[u].append(w); deg[w]+=1\nq=[x for x in range(1,n+1)if deg[x]==0]; heapq.heapify(q); out=[]\nwhile q:\n    u=heapq.heappop(q); out.append(u)\n    for w in a[u]:\n        deg[w]-=1\n        if deg[w]==0: heapq.heappush(q,w)\nprint(\" \".join(map(str,out)) if len(out)==n else \"CIKLUS\")\n",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<vector<int>>a(n+1);vector<int>deg(n+1);while(m--){int u,v;cin>>u>>v;a[u].push_back(v);deg[v]++;}priority_queue<int,vector<int>,greater<int>>q;for(int i=1;i<=n;i++)if(!deg[i])q.push(i);vector<int>out;while(!q.empty()){int u=q.top();q.pop();out.push_back(u);for(int v:a[u])if(--deg[v]==0)q.push(v);}if((int)out.size()!=n)cout<<\"CIKLUS\";else for(int x:out)cout<<x<<\" \";\nreturn 0;}\n"
    }
  }
};
