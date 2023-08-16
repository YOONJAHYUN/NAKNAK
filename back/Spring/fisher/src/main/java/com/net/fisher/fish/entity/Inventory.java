package com.net.fisher.fish.entity;

import com.net.fisher.fish.entity.Fish;
import com.net.fisher.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity(name = "inventories")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
<<<<<<< HEAD
=======
@ToString
>>>>>>> 849874c40f88a8bfcf84d3c8ca41374d99d78fae
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private long inventoryId;

    @ManyToOne
    @JoinColumn(name = "member_id")
    @Setter
    private Member member;

    @ManyToOne
    @JoinColumn(name = "fish_id")
    @Setter
    private Fish fish;

    /*@Column(name = "x_direction")
    private int x;

    @Column(name = "y_direction")
    private int y;*/

    @Column(name = "size")
    @Setter
    private double size;
}
