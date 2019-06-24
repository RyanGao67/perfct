from pyspark.sql import SparkSession
from py4j.java_gateway import java_import
import time
from pyspark.sql import functions as F
from pyspark.sql.types import *



 
spark = SparkSession.builder \
  .appName("Embedding Spark Thrift Server") \
  .config("spark.sql.hive.thriftServer.singleSession", "True") \
  .config("hive.server2.thrift.port", "10001") \
  .config("javax.jdo.option.ConnectionURL", \
  "jdbc:derby:;databaseName=metastore_db2;create=true") \
  .enableHiveSupport() \
  .getOrCreate()

df = spark.read.option("header","true").csv("/home/ryangao67/Downloads/indoc/NSCLC_STG_2018-Nov-14.csv")
df.createOrReplaceTempView('NSCLC_STG')
df = spark.read.option("header","true").csv("/home/ryangao67/Downloads/indoc/NSCLC_DIAG_2018-Nov-14.csv")
df.createOrReplaceTempView('NSCLC_DIAG')
sc = spark.sparkContext
java_import(sc._gateway.jvm, "")
#Start Spark Thrift Server using the jvm and passing the SparkSession
sc._gateway.jvm.org.apache.spark.sql.hive.thriftserver \
  .HiveThriftServer2.startWithContext(spark._jwrapped)

nsclc_stg = spark.sql("select * from NSCLC_STG")
for col in nsclc_stg.columns:
    nsclc_stg = nsclc_stg.withColumnRenamed(col, col.lower().replace(' ','_'))
nsclc_diag = spark.sql("select * from NSCLC_DIAG")
for col in nsclc_diag.columns:
    nsclc_diag = nsclc_diag.withColumnRenamed(col, col.lower().replace(' ','_'))

nsclc_stg.write \
  .mode('overwrite')\
  .format("jdbc") \
  .option("url", 'jdbc:postgresql://localhost:5432/testdb') \
  .option("dbtable", 'nsclc_stg') \
  .option("user", 'testuser') \
  .option("password", '123456') \
  .option("driver", "org.postgresql.Driver") \
  .save()

nsclc_diag.write \
  .mode('overwrite')\
  .format("jdbc") \
  .option("url",'jdbc:postgresql://localhost:5432/testdb') \
  .option("dbtable", 'nsclc_diag') \
  .option("user", 'testuser') \
  .option("password", '123456') \
  .option("driver", "org.postgresql.Driver") \
  .save()

# molecualr
df = spark.read.option("header","true").csv("/home/ryangao67/Downloads/indoc/molecular.csv")
columns = df.columns

for col in df.columns:
    df = df.withColumnRenamed(col, col.lower().replace(' ','_'))
# def mapper(row):
#   result = {}
#   result['info'] = {}
#   for i in range(len(row)):
#     if i==0:
#       result['patient'] = row[0][7:11]
#     result['info'][df.column[i]] = row[i]
#   return result

# df_rdd = df.rdd.map(mapper)
df.write.format(
    'org.elasticsearch.spark.sql'
).option(
    'es.nodes', 'localhost'
).option(
    'es.port', 9200
).option(
    'es.resource', '%s/%s' % ('perfct', '_doc'),
).save()
