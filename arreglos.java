import java.util.Scanner;

public class arreglos {
    public static void main(String[] args) {
    
        String[] alumnos = new String[27];
        boolean[] asistencia = new boolean[27];
        Scanner consola = new Scanner (System.in);

        alumnos[0] = "Álvarez Urrea Chelsea Jeraldyn";
        alumnos[1] = "Avila Ramirez Emmanuel";
        alumnos[2] = "Escareño Solorio Juan Mauricio";
        alumnos[3] = "Escobedo Guerra Victor Manuel";
        alumnos[4] = "González De Alba Francisco Javier";
        alumnos[5] = "Gonzalez Rossi Santiago";
        alumnos[6] = "Hernandez Aguilar Emiliano";
        alumnos[7] = "Lozano Aldana José Mariano";
        alumnos[8] = "Macias Hernandez Luis Leonardo";
        alumnos[9] = "Manrique Morales Fernanda Arely";
        alumnos[10] = "Marquez Esparza Saul Alejandro";
        alumnos[11] = "Meza Lozano Barbara";
        alumnos[12] = "Montoya Sandoval Viery Dassaeb";
        alumnos[13] = "Ornelas González Gael";
        alumnos[14] = "Pimentel Dolores Angel Salvador";
        alumnos[15] = "Piñon Garcia Axel Emmanuel";
        alumnos[16] = "Ramírez Zaldumbide Ignacio Xavier";
        alumnos[17] = "Rodríguez Arellano Cruz Ángel";
        alumnos[18] = "Rodríguez Santoyo Diego Tadeo";
        alumnos[19] = "Sánchez Álvarez Ingrid Regina";
        alumnos[20] = "Sierra Perez José Angel";
        alumnos[21] = "Torres Gonzalez Cesar Santiago";
        alumnos[22] = "Tovar Romero Jhostyn Alexander";
        alumnos[23] = "Trejo Hernández Jorge Alonso";
        alumnos[24] = "Vazquez Gomez Angel De Jesus";
        alumnos[25] = "Vilchis Perez Jose Miguel";
        alumnos[26] = "Viveros Tellez Kevin";
        
        System.out.println("Escribe True si asistio / False si no:");
        
        for (int i=0;i<alumnos.length;i++ ){

            System.out.println("Asistio?" + alumnos[i]);
            asistencia[i] = Boolean.parseBoolean(consola.nextLine()); 
        }

        // reporte de asistencia
        int asistencias = 0;
        int faltas = 0;
        
        for (int i=asistencia.length; i>0 ;i--){
            if(asistencia[i-1]){
                asistencias++;
            }
            else{
                faltas++;
            }

        }

        // cuantos asistieron
        // cuantos faltaron
        System.out.println("El numero de personas que asistieron son: " + asistencias);
        System.out.println("El numero de personas que faltaron son: " + faltas);


        // quienes faltaron

        System.out.println("Las personas que faltaron son: ");
         for (int i=0; i<asistencia.length ;i++){
            if(!asistencia[i]){
                System.out.println(alumnos[i]);
            }
            

        }


    }
    
}
