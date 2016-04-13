array=(2 5)
for i in "${array[@]}"
do
	sh ./test.sh $i
	sleep 10
done

