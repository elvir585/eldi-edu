otvoreni = sum(input().strip() == "DA" for _ in range(3))
if otvoreni == 3:
    print("promaha")
elif otvoreni > 0:
    print("vjetrenje")
else:
    print("ustajao vazduh")
