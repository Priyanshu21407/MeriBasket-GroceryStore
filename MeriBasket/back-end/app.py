from flask import Flask, jsonify,render_template,request,redirect,session,url_for
from flask_cors import CORS
import mysql.connector
from flask_mysqldb import MySQL
import time

app=Flask(__name__)
app.secret_key='userid'
app.secret_key='checkopt'
app.secret_key='product'
import mysql.connector

app = Flask(__name__)
CORS(app)

# db = mysql.connector.connect(
#   host="localhost",
#   user="root",
#   password="123", 
#   database="schema1",
#   autocommit=True
# )

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '123'
app.config['MYSQL_DB'] = 'schema1'


mysql=MySQL(app)

@app.route('/api/login',methods=['POST'])

def get_data():

    jsondata=request.json
    
    userID=jsondata.get('uid')
    password=jsondata.get('pass')
    print("here")
    print(userID)
    print(password)
    cur=mysql.connection.cursor()
    query="select * from customer where email_ID=\'"+userID+"\' and account_password=\'"+password+"\'"
    cur.execute(query)
    custdata=cur.fetchall()
    mysql.connection.commit()
    print(custdata)
    cur.close()
    return jsonify(custdata)

@app.route('/api/Search',methods=['POST'])
def get_products():
    
    jsondata=request.json
    prod=jsondata.get('search_query')
    cur=mysql.connection.cursor()
    priceH=10000
    priceL=0
    rating=0
    query="select * from product join items on item_prod_id=product_id where product_name LIKE\'%"+str(prod)+"%\' and price>="+str(priceL)+" and price<="+str(priceH)+" and rating>="+str(rating)
    cur.execute(query)
    mysql.connection.commit()
    proddata=cur.fetchall()
    cur.close()

    return jsonify(proddata)


@app.route('/api/ProfileDetails',methods=['GET','POST'])

def profDetails():
    jsondata=request.json
    custdata=jsondata.get('userDetail')
    print("here")
    print(jsondata)
    custdata=custdata.split(',')
    userName=str(custdata[1])+" "+str(custdata[2])+" "+str(custdata[3])
    userAdd=str(custdata[5])+", "+str(custdata[6])+", "+str(custdata[7])+", pincode: "+str(str(custdata[8]))
    userContact=str(str(custdata[9]))+", "+str(str(custdata[10]))+", "+str(str(custdata[11]))
    userEmail=str(custdata[12])
    detail=[]
    detail.append(userName)
    detail.append(userAdd)
    detail.append(userContact)
    detail.append(userEmail)
    print(detail)
    return jsonify(detail)

@app.route('/api/cart',methods=['POST'])

def cart():
    jsondata=request.json
    custdata=jsondata.get('userDetail')
    custdata=custdata.split(',')
    cur=mysql.connection.cursor()
    print("here")
    print("ITEMCARTID"+custdata[0])
    cur.execute("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));")
    cartQ="select item_name,effective_price,item_quantity,item_id,item_order_id,item_prod_id from items where item_cart_id="+str(custdata[0])+" group by item_name;"
    cur.execute(cartQ)
    mysql.connection.commit()
    CartData=cur.fetchall()
    cur.close()
    print(CartData)
    return jsonify(CartData)

@app.route('/api/Orders',methods=['POST'])
def custOrd():
    jsondata=request.json
    custdata=jsondata.get('userDetail')
    custdata=custdata.split(',')
    cnx=mysql.connection.cursor()

    cnx.execute("select order_id,order_status from schema1.order where order_cust_id="+str(custdata[0]))
    mysql.connection.commit()
    ordersD=cnx.fetchall()
    print(ordersD)
    allorderItem=[]
    orderstat=[]
    for i in ordersD:
        li=[]
        oid=int(i[0])
        li.append(oid)
        li.append(i[1])
        #cur.execute("select * from item_ord where orderID="+str(oid))
        cnx.execute("select * from schema1.item_ord where orderID="+str(oid))
        mysql.connection.commit()
        itemD=cnx.fetchall()
        if len(itemD)!=0:
            for j in itemD:
                li.append(list(j))
            orderstat.append(i[1])
        allorderItem.append(li)
    print(allorderItem)
    return jsonify(allorderItem)


@app.route('/api/addProd',methods=['GET','POST'])
def addProd():
    if request.method=='POST':
        jsondata=request.json
        prod=jsondata.get('productDetail')
        #prod=str(prod[1:])
        print(prod)
        custdata=jsondata.get('userDetail')
        custdata=custdata.split(',')
        cur=mysql.connection.cursor()

        priceH=10000
        priceL=0
        rating=0
        query="select * from product join items on item_prod_id=product_id where product_name LIKE\'%"+str(prod)+"%\' and price>="+str(priceL)+" and price<="+str(priceH)+" and rating>="+str(rating)
        cur.execute(query)
        proddata=cur.fetchall()
        ind=0

        for j in range(len(proddata)):
            if proddata[j][0]==prod:
                ind=j
                break

        effPrice=proddata[ind][3]

        cur.execute("show triggers")
        triggerD=cur.fetchall()

        tflag1=0
        for i in triggerD:
            if str(i[0])=="item_qty_check":
                tflag1=1
                break
        if tflag1==0:
            trigquery="create trigger item_qty_check before insert on items for each row begin if new.item_quantity>3 then set new.item_quantity=3; end if; end"
            cur.execute(trigquery)
        itemqty=1
        if itemqty>3:
            itemqty=3
        cur.execute("select max(item_id) from items")
        itemidnew=(cur.fetchall())
        itemidnew=list(itemidnew)
        itemidnew=list(itemidnew[0])
        itemidnew=int(itemidnew[0])
        print(itemidnew)
        cur.execute("select * from schema1.order")
        orderid=cur.fetchall()
        orderid=len(orderid)
        print(orderid)
        print("Item ID "+str(itemidnew))

            #cur.execute("insert into schema1.order values("+str(orderid+1)+",0,"+str(custdata[0][0])+",1)")
        print(orderid)
        query1="insert into items values("+str(itemidnew+1)+",\'"+str(proddata[ind][1])+"\',"+str(itemqty)+","+str(effPrice)+","+str(custdata[0])+","+str(proddata[ind][0])+","+str(orderid)+")"
        cur.execute(query1)
        tempquery="select * from items where item_id="+str(itemidnew +1)
        cur.execute(tempquery)
        data=cur.fetchall()
        print("You added the following item in your cart: ")
        print("item name: "+str(proddata[ind][1])+" Quantity: "+str(data[0][2]))
        cur.execute("update cart set current_amount=current_amount+"+str(data[0][2])+"*"+str(effPrice))
        mysql.connection.commit()
        cur.close()
    return 'added to cart!'


@app.route('/api/Checkout',methods=['GET','POST'])
def checkout():
    jsondata=request.json
    custdata=jsondata.get('userDetail')
    custdata=custdata.split(',')
    cur=mysql.connection.cursor()
    cur.execute("Select * from cards where cards.id="+str(custdata[0]))
    carddata=cur.fetchall()
    mysql.connection.commit()
    cur.close()    
    return jsonify(carddata[0])



@app.route('/api/post_order',methods=['POST','GET'])

def post_order():
    jsondata=request.json
    custdata=jsondata.get('userDetail')
    checkOpt=jsondata.get('paymentOption')
    custdata=custdata.split(',')
    cur=mysql.connection.cursor()
    cur.execute("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));")
    cartQ="select item_name,effective_price,item_quantity,item_id,item_order_id,item_prod_id from items where item_cart_id="+str(custdata[0])+" group by item_name;"
    cur.execute(cartQ)
    CartData=cur.fetchall()
    cartSum=0
    for i in CartData:
        cartSum+=i[1]

    cur.execute("select * from retailstore where store_address_city=\'"+str(custdata[6])+"\'")
    retailNear=cur.fetchall()
    retailNearIDLi=[]
    if len(retailNear)!=0:
        for i in retailNear:
            retailNearIDLi.append(i[0])
        retailNearID=retailNearIDLi[0]
        cur.execute("select * from payment")
        paymentD=cur.fetchall()
        newid=len(paymentD)+1
        cur.execute("select * from schema1.order")
        orderidnew=cur.fetchall()
        currenttime=str(time.time())
        cur.execute("insert into schema1.order values("+str(len(orderidnew)+1)+",\'"+str(currenttime)+"\',"+str(custdata[0])+","+str(retailNearID)+","+str(0)+")")
        for i in CartData:
            cur.execute("insert into schema1.item_ord values("+str(i[5])+", \'"+str(i[0])+"\', "+str(i[2])+", "+str(i[1])+", "+str(len(orderidnew)+1)+")")
        print("Waiting for verification from the outlet...")
        print("Proceed to \'Orders\' to view its status")
        
        # cur.execute("update schema1.order set order_date=\'"+str("2022-04-27 00:38:54")+"\', order_retail_id="+str(retailNearID)+" where order_id="+str(CartData[0][4]))
        # cur.execute("insert into schema1.order values( "+str(CartData[0][4]+1)+",\'"+str("2022-04-27 00:38:54")+"\',"+str(custdata[0][0])+", "+str(retailNearID)+")")
        
        cur.execute("insert into payment values( "+str(newid)+","+str(checkOpt)+","+str(cartSum)+","+str(custdata[0])+","+str(len(orderidnew)+1)+" )")
        cur.execute("delete from items where item_cart_id="+str(custdata[0]))
        ordersetFlag=0
        mysql.connection.commit()
        return 'Order processed!'    
    else:
        mysql.connection.commit()
        return "No retail outlet found nearby. Please try again later"
    
@app.route("/api/Retail/Login",methods=['POST'])
def retail_login():
    jsondata=request.json
    userID=jsondata.get('uid')
    password=jsondata.get('pass')
    print("here")
    print(userID)
    print(password)
    cnx=mysql.connection.cursor()
    LoginQ="select * from retailstore where email_ID=\'"+userID+"\' and account_password=\'"+password+"\'"
    cnx.execute(LoginQ)
    mysql.connection.commit()
    data=cnx.fetchall()
    if len(data)>0:
        data=data[0]
    print(data)
    cnx.close()
    return jsonify(data)

@app.route("/api/Retail/Orders",methods=['Post'])
def retail_order():
    jsondata=request.json
    ret_data=jsondata.get('userDetail')
    cur=mysql.connection.cursor()
    cur.execute("select * from schema1.order join item_ord on item_ord.orderID=schema1.order.order_id where order_retail_id="+str(ret_data[0])+" and order_status="+str(0))
    retOrd=cur.fetchall()
    print("request",len(retOrd))

    ord_req=[]
    li=[]
    temp=-1
    for i in retOrd:
        it=[]
        if temp!=i[0]:
            if temp!=-1:
                ord_req.append([temp,li])
            li=[]
            temp=i[0]
        for j in range(1,len(i)):
            it.append(i[j])
        li.append(it)

    if len(li):
        ord_req.append([temp,li])
    
    print(li)
    cur.execute("select * from schema1.order join item_ord on item_ord.orderID=schema1.order.order_id where order_retail_id="+str(ret_data[0])+" and order_status="+str(1))
    retOrd=cur.fetchall()

    ord_completed=[]
    li=[]
    temp=-1
    for i in retOrd:
        it=[]
        if temp!=i[0]:
            if temp!=-1:
                ord_completed.append([temp,li])
            li=[]
            temp=i[0]
        for j in range(1,len(i)):
            it.append(i[j])
        li.append(it)
    if len(li):
        ord_completed.append([temp,li])
    allOrd=[ord_req,ord_completed]
    print("\n\n")
    print(allOrd)
    return jsonify(allOrd)
        
@app.route("/api/Retail/setDiscount",methods= ['POST'])

def set_discount() : 
    jsondata=request.json
    retData=jsondata.get('userDetail')
    discount_value=jsondata.get('discount_value')
    discount_type=jsondata.get('discount_type')
    if discount_type=='type1':
        discount_type=1
    else:
        discount_type=2
    discount_prod_id=jsondata.get('discount_prod_id')
    cur=mysql.connection.cursor()
    cur.execute("select max(discount_id) from discount")
    discIDnew=list(cur.fetchall())
    discIDnew=list(discIDnew[0])
    discIDnew=int(discIDnew[0])
    cur.execute("insert into discount values("+str((discIDnew)+1)+","+str(discount_value)+","+str(discount_type)+","+str(retData[0])+","+str(discount_prod_id)+")")
    mysql.connection.commit()
    cur.close()
    print("Discount added")
    return 'Discount Added!'

@app.route("/api/Retail/getDiscounts",methods= ['POST'])
def get_discount():
    jsondata=request.json
    retData=jsondata.get('userDetail')
    cur=mysql.connection.cursor()
    cur.execute("select * from discount where disc_store_id="+str(retData[0]))
    get_disc=cur.fetchall()
    mysql.connection.commit()
    cur.close()
    return jsonify(get_disc)

@app.route('/api/Retail/OrderAccept',methods=['POST'])
def order_accept():
    jsondata=request.json
    retData=jsondata.get('userDetail')
    action=jsondata.get('orderID')
    opt=jsondata.get('opt')
    
    cur=mysql.connection.cursor()
    
    response=''

    if opt == 1:
        cur.execute("update schema1.order set order_status="+str(1)+" where order_id="+str(action))

        print("Order Accepted")

        cur.execute("Select * from deliveryagent where location_city=\'"+str(retData[3])+"\'")
        agentNear=cur.fetchall()
        cur.execute("select * from delivery_req")
        delnewid=cur.fetchall()
        for i in agentNear:
            cur.execute("insert into delivery_req values("+str(len(delnewid)+1)+","+str(i[0])+",0,"+str(action)+")")
        response='Order Accepted!'
    else:
        cur.execute("update schema1.order set order_status="+str(0)+" where order_id="+str(action))
        cur.execute("insert into ret_ord_rej values("+str(retData[0])+","+str(action)+")")
        print("Order Rejected")
        ind=3
        while(True):
            if ind==3:
                cur.execute("select * from retailstore where store_address_city=\'"+str(retData[ind])+"\'")
            else:
                cur.execute("select * from retailstore")
            newretids=cur.fetchall()
            if len(newretids)!=0:
                break
            ind+=1

        print("\n\nnew retails",newretids)
        flag=0
        for retids in newretids:
            # cur.execute("select * from ret_ord_rej where ID_retail="+str(retids[0])+" and ID_order="+str(action))
            # ordverify=cur.fetchall()
            cur.execute("update schema1.order set order_retail_id="+str(retids[0])+" where order_id="+str(action))
        print("\n\nFLAG VALUE",flag)

        response='Order Rejected!'
    mysql.connection.commit()
    cur.close()
    return response

@app.route("/api/Agent/Login",methods=['POST'])
def agent_login() :
    jsondata=request.json
    uid=jsondata.get('uid')
    password=jsondata.get('pass')
    print("here")
    print(uid)
    print(password)
    cur=mysql.connection.cursor()
    query = "select * from deliveryagent where agent_id="+str(uid)+" and account_password=\'"+str(password)+"\'"
    cur.execute(query)
    agentD=cur.fetchall()
    mysql.connection.commit()
    cur.close()
    return jsonify(agentD)

@app.route("/api/Agent/Requests", methods=['POST'])
def agent_delivery_req() :
    jsondata=request.json
    agent=jsondata.get('userDetail')
    cur=mysql.connection.cursor()
    agent=agent.split(',')
    agentID=agent[0]
    print(agent)
    #cur.execute("select * from delivery_req where deli_agent_id="+str(agentID)+" and deli_req=1")

    cur.execute("select d.deli_id, address_street, address_city, address_state from customer as c join schema1.order as o on c.customer_id=o.order_cust_id join delivery_req as d on d.deli_order_id=o.order_id where d.deli_agent_id="+str(agentID)+" and d.deli_req=0")

    toAddress=cur.fetchall()

    cur.execute("select d.deli_id, store_address_street, store_address_city, store_address_state from retailstore as r join schema1.order as o on r.retail_id=o.order_retail_id join delivery_req as d on d.deli_order_id=o.order_id where d.deli_agent_id="+str(agentID)+" and d.deli_req=0")
    
    fromAddress = cur.fetchall()
    
    sorted(fromAddress,key=lambda s:int(s[0]))
    sorted(toAddress,key=lambda s:int(s[0]))

    delreq = [fromAddress,toAddress]

    result = []

    for i in range(len(fromAddress)):
        sub=[]
        tempTo=list(toAddress[i])
        sub.append(tempTo[0])
        tempTo.pop(0)
        tempTo=list(tempTo)
        
        tempFrom=list(fromAddress[i])
        tempFrom.pop(0)
        tempFrom=list(tempFrom)
        sub.append(tempFrom)
        sub.append(tempTo)
        result.append(sub)
    mysql.connection.commit()
    cur.close()
    return jsonify(result)

@app.route("/api/Agent/Request_action", methods=['POST'])
def request_action() :
    jsondata=request.json
    agent=jsondata.get('userDetail')
    reqid=jsondata.get('request_id')
    action=jsondata.get('action')
    print(agent)
    print("REQID",reqid)
    agent=agent.split(',')
    agentId=agent[0]
    print("\n\nID",agentId)
    response = ""
    cur=mysql.connection.cursor()
    if action == 'Accept': 
        cur.execute("update delivery_req set deli_req=1 where deli_agent_id="+str(agentId)+" and deli_id="+str(reqid))
        cur.execute("delete from delivery_req where deli_id="+str(reqid)+" and deli_req=0")

        cur.execute("select * from delivery_req where deli_agent_id="+str(agentId)+" and deli_id="+str(reqid))
        delidata=cur.fetchall()
        delidata=list(delidata)
        print("\n\nDATA",delidata)
        delidata=delidata[0]

        cur.execute("select * from delivery")
        deliveryid=cur.fetchall()
        currenttimedel=str(time.time())
        cur.execute("insert into delivery values("+str(len(deliveryid)+1)+",\'"+str(currenttimedel)+"\',"+str(0)+","+str(agentId)+","+str(delidata[3])+")")
        response = "Delivery accepted!"
    else:
        cur.execute("delete from delivery_req where deli_id="+str(reqid)+" and deli_agent_id="+str(agentId))
        response = "Delivery request removed!"

    mysql.connection.commit()
    cur.close()

    return response

@app.route("/api/Agent/Ongoing",methods=['POST'])
def ongoing_delivery() :
    jsondata=request.json
    agent=jsondata.get('userDetail')
    agent=agent.split(',')
    agentId=agent[0]
    cur=mysql.connection.cursor()
    cur.execute("select * from delivery where agent_id="+str(agentId)+" and delivery_status=0")
    pendingDel=cur.fetchall()
    print("DATAA",pendingDel)
    mysql.connection.commit()
    cur.close()
    return jsonify(pendingDel)



@app.route("/api/Agent/Ongoing_action",methods=['POST'])
def mark_ongoing() :
    jsondata=request.json
    agent=jsondata.get('userDetail')
    agent=agent.split(',')
    agentId=agent[0]
    delivery_id=jsondata.get('delivery_id')
    cur=mysql.connection.cursor()
    cur.execute("select * from delivery where agent_id="+str(agentId)+" and delivery_status=0")
    pendingDel=cur.fetchall()

    cur.execute("update delivery set delivery_status=1 where agent_id="+str(agentId)+" and delivery_id="+str(delivery_id))
    response = "Marked as done for delivery: "+str(delivery_id)
    mysql.connection.commit()
    cur.close()

    return response

if __name__ == '__main__':
    app.run()