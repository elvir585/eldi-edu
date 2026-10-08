#include <bits/stdc++.h>
using namespace std;
int N;
long long memo [45] [2];
long long f(int pos, int prev1) {
    if (pos == N) return 1;
    long long & res = memo [pos] [prev1];
    if (res != - 1) return res;
    res = f(pos + 1, 0);
    if (! prev1) res += f(pos + 1, 1);
    return res;
}
int main() {
    cin >> N;
    memset(memo, - 1, sizeof(memo));
    cout << f(0, 0) << "\n";
}
