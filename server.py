import http.server
import urllib.request
import urllib.error
import json

TOKEN   = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ilh0LW83aERicHVwQXotWlBtNkh4Q0ZXUzNjSSIsImtpZCI6Ilh0LW83aERicHVwQXotWlBtNkh4Q0ZXUzNjSSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMzBiOGIyNmEtZDMwZi00MmIzLTg2NmItNWFjNjNmZGRkMzliLyIsImlhdCI6MTc3Nzk5Nzk5NSwibmJmIjoxNzc3OTk3OTk1LCJleHAiOjE3NzgwMDIzOTQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVVFBdS84Y0FBQUFHSE9EbWdnd0drby9CSFoyeE1wWXlHQlZhUDhya3ZFMDhBNEJiZVVDTk4zUTJpdG00U2dsbzkwVXM0U1o2ZStZZ2NiYTh6SlZWU0NTQ1dFL2tNc1BPQT09IiwiYW1yIjpbInB3ZCIsInJzYSJdLCJhcHBpZCI6Ijg3MWMwMTBmLTVlNjEtNGZiMS04M2FjLTk4NjEwYTdlOTExMCIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiNDVhNjQ5MmEtMDlkMC00MmU5LTlkMjYtMjk1ZTRjOWZhMTA1IiwiZmFtaWx5X25hbWUiOiJTb2xvcnphbm8iLCJnaXZlbl9uYW1lIjoiR2lsYmVydG8iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxODkuMjIzLjI1Mi4zNCIsIm5hbWUiOiJTb2xvcnphbm8sIEdpbGJlcnRvIiwib2lkIjoiYjk0M2YyODQtZTczYS00YzhjLTg0YTMtZTM4OWNiYmIwMjVkIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTUxODgwMTQxOS04Mzc1NTgxMDAtMzg5NzEzNzc0Mi0yNTgzNTAiLCJwdWlkIjoiMTAwMzIwMDVBMTQ2RTUzRCIsInJoIjoiMS5BWFVBYXJLNE1BX1RzMEtHYTFyR1A5M1Rtd2tBQUFBQUFBQUF3QUFBQUFBQUFBQUFBT0oxQUEuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lkIjoiMDAyMmFiMWEtMTk0My04MDJhLWQ1ZGYtM2RiNTA1ZWU0NWFiIiwic2lnbmluX3N0YXRlIjpbImR2Y19tbmdkIiwiZHZjX2NtcCIsImR2Y19kbWpkIiwiaW5rbm93bm50d2siLCJrbXNpIl0sInN1YiI6IkdBbUllc3JQd2VqdTlOTlNCNjZRengyTFNJbzBrb0dfQzZXT25zM0d3VDQiLCJ0aWQiOiIzMGI4YjI2YS1kMzBmLTQyYjMtODY2Yi01YWM2M2ZkZGQzOWIiLCJ1bmlxdWVfbmFtZSI6ImMtZ3NvbG9yemFub0BhbGxlZ2lvbi5jb20iLCJ1cG4iOiJjLWdzb2xvcnphbm9AYWxsZWdpb24uY29tIiwidXRpIjoieklJSUhRZzFjVTZRRHltR1ZFOEFBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19hY3RfZmN0IjoiMyA1IiwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfZnRkIjoiRkl0MUZOMnFIMlZfVU15MnpnSFRCdm0ycHM2RGppbGxBZXZpSDk3eHdmVUJkWE56YjNWMGFDMWtjMjF6IiwieG1zX2lkcmVsIjoiOCAxIiwieG1zX3N1Yl9mY3QiOiIzIDgifQ.fya-Y3DrM-WzgxYDA3EgqIe_6mKBmwnv6IB3Ma-l2M7XmIgVj3aE8HVPCgI1D_mlL1LGUPu2NocfQVgUb3TElMgZwHZMQmOXMw21_P7VW_m7xKjepgMKAze6gfmFvPthkFZfo_C55Z0lOPI7u-skecM3z4HVfo2qavXMnAqlcJVRfaPF20zEMjXWJFctoNCUjVaoUDd5DD9EzC64QDuTYcckjZeEBmC1eccTqJ60l7XLCERoNl-fibvgJdkupb6jmesS1LpswazAoL_HeCBQnHzaWsQ2D_1PFzqslI5TsO08jZKmua4ujjjomo2v1A-7yCYblMmuPI43HJ3_pbZ5JA"
DATASET = "f56c15af-875f-48b1-9979-378b890907ec"

class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            url = f"https://api.powerbi.com/v1.0/myorg/datasets/{DATASET}/executeQueries"
            req = urllib.request.Request(url, method='POST')
            req.add_header('Authorization', f'Bearer {TOKEN}')
            req.add_header('Content-Type', 'application/json')
            
            body = json.dumps({
                "queries": [{
                    "query": "EVALUATE SELECTCOLUMNS('Rechazo', \"Cell_Name\", 'Rechazo'[Cell_Name], \"Turno1\", 'Rechazo'[Rejected_Units], \"Turno2\", 'Rechazo'[Rejected_UnitsTurno2])"
                }],
                "serializerSettings": {"includeNulls": True}
            }).encode()

            print('📡 Llamando a Power BI...')
            response = urllib.request.urlopen(req, body, timeout=30)
            data     = response.read()
            print('✅ Datos recibidos!')

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(data)

        except urllib.error.HTTPError as e:
            error = e.read().decode()
            print(f'❌ HTTP Error {e.code}: {error}')
            self.send_response(e.code)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(error.encode())

    def log_message(self, format, *args):
        pass

print('✅ Servidor corriendo en puerto 3000')
http.server.HTTPServer(('', 3000), Handler).serve_forever()