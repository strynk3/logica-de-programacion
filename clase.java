void main(){

double sancion, total, sueldo_bruto, neto, bono;

/*
Para que el usuario agregue los datos del array en solo 6 espacios
int[] Dias;
Dias = new int[6];
*/

int[] Dias;
Dias = new int[6];

/* 
float[] Dias = {1,2,3,4,5,6};
*/

/* se le agrega "final" para que BONO no cambie su valor despues 
final double BONO = 0;
*/


String nombre = IO.readln("Escribe tu nombre: ");

double pago_hora = Double.parseDouble(IO.readln("Holaa " + nombre + ", ingresa cuanto te pagan por hora: "));

char falta = IO.readln("¿Faltaste algun dia? (y/n): ").charAt(0);


for (int i = 0; i < Dias.length; i++){
    System.out.println("Ingrese las horas que trabajaste en el dia " + i + " : ");
    Dias[i] = Integer.parseInt(IO.readln());
}

total = 0;

for (int n : Dias) {
    total += n;
}

System.out.println("Las horas totales son: " + total);

if (falta == 'n' && total > 40) {

    sueldo_bruto = pago_hora * total;
    bono = (sueldo_bruto * 15) / 100;
    neto = bono + sueldo_bruto;
    
    System.out.println(nombre + " tiene " + total + " de horas, que se pagan a " + pago_hora);
    System.out.println("");

    System.out.println("En el dia 1 trabajaste " + Dias[0] + ".");
    System.out.println("En el dia 2 trabajaste " + Dias[1] + ".");
    System.out.println("En el dia 3 trabajaste " + Dias[2] + ".");
    System.out.println("En el dia 4 trabajaste " + Dias[3] + ".");
    System.out.println("En el dia 5 trabajaste " + Dias[4] + ".");
    System.out.println("En el dia 6 trabajaste " + Dias[5] + ".");

    System.out.println("Tuviste un bono de " + bono + " y el total de tu sueldo es de " + neto);

} else if ( falta == 'n' && total <= 40) {

    sueldo_bruto = pago_hora * total;

    System.out.println(nombre + " tiene " + total + " de horas, que se pagan a " + pago_hora);
    System.out.println("");

    System.out.println("En el dia 1 trabajaste " + Dias[0] + ".");
    System.out.println("En el dia 2 trabajaste " + Dias[1] + ".");
    System.out.println("En el dia 3 trabajaste " + Dias[2] + ".");
    System.out.println("En el dia 4 trabajaste " + Dias[3] + ".");
    System.out.println("En el dia 5 trabajaste " + Dias[4] + ".");
    System.out.println("En el dia 6 trabajaste " + Dias[5] + ".");

    System.out.println("No tuviste un bono y el total de tu sueldo es de " + sueldo_bruto);
} else if (falta == 'y' && total >= 1){

    sueldo_bruto = pago_hora * total;
    sancion = (sueldo_bruto * 10) / 100;
    neto = sueldo_bruto - sancion;
    

    System.out.println(nombre + " tiene " + total + " de horas, que se pagan a " + pago_hora);
    System.out.println("");

    System.out.println("En el dia 1 trabajaste " + Dias[0] + ".");
    System.out.println("En el dia 2 trabajaste " + Dias[1] + ".");
    System.out.println("En el dia 3 trabajaste " + Dias[2] + ".");
    System.out.println("En el dia 4 trabajaste " + Dias[3] + ".");
    System.out.println("En el dia 5 trabajaste " + Dias[4] + ".");
    System.out.println("En el dia 6 trabajaste " + Dias[5] + ".");

    System.out.println("Tuviste una sancion de " + sancion + " y el total de tu sueldo es de " + neto);

} else if ( total <= 0) {
    System.out.println("Tienes que trabajar, tu sueldo es de 0");
}


/*
System.out.println("Hola " + nombre + ", te pagan " + pago_hora + " por cada hora");
 */



}

