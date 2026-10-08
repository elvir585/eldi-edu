a = int(input())
b = int(input())
c = int(input())
bus = a + b
print('AUTOBUS' if bus <= c else 'VOZ')
print(abs(bus - c))
